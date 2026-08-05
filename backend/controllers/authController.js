const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");
const transporter = require("../config/nodemailer.js");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handelUserSignup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    let { fullName, email, password, mobile, phone, city, district, state } =
      req.body;

    // Trim input fields
    fullName = fullName?.trim();
    email = email?.trim()?.toLowerCase();
    password = password?.trim();
    const resolvedPhone = String(phone || mobile || "").trim();

    if (!fullName) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!resolvedPhone) {
      return res.status(400).json({ success: false, message: "Mobile number is required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Phone is mandatory.
    if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(resolvedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    // Check duplicate by phone and email
    const existingUser = await userModel.findOne({
      $or: [{ phone: resolvedPhone }, { email }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (existingUser.phone === resolvedPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      fullName,
      email,
      password: hashedPassword,
      phone: resolvedPhone,
      city: city?.trim() || undefined,
      district: district?.trim() || undefined,
      state: state?.trim() || undefined,
      isEmailVerified: false,
    };

    // Create new user
    const newUser = await userModel.create(newUserData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Remove password before sending response
    const userObj = newUser.toObject();
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      userData: userObj,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const handelUserLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and password are required",
      });
    }

    const loginIdentifier = String(emailOrMobile).trim();

    // Check if input is email or phone number
    const isEmail = loginIdentifier.includes("@");
    const isMobile = /^\+?[\d\s\-\(\)]{10,15}$/.test(loginIdentifier);

    if (!isEmail && !isMobile) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email or phone number",
      });
    }

    // Find user by email or phone
    const query = isEmail
      ? { email: loginIdentifier.toLowerCase() }
      : { phone: loginIdentifier };

    const user = await userModel.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: isEmail ? "Invalid email" : "Invalid phone number",
      });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    const isAdmin = user.role === 'admin';
    const token = jwt.sign(
      { userId: user._id, role: isAdmin ? 'admin' : 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    const cookieName = isAdmin ? 'admin_token' : 'token';
    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Convert to object for manipulation and remove sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userData: userObj,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const handleUserLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("admin_token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const generateResetPassOTP = async (req, res) => {
  try {
    const normalizedEmail = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    if (!normalizedEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email address" });
    }

    const getUser = await userModel.findOne({ email: normalizedEmail });

    if (!getUser) {
      return res.status(400).json({
        success: false,
        message: `User with this email doesn't exist`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    getUser.resetOtp = otp;
    getUser.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    await getUser.save();

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@computerstore.com",
      to: normalizedEmail,
      subject: "Password Reset OTP - Computer Store",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Generate OTP Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const submitResetPassOTP = async (req, res) => {
  try {
    const { otp, newPass, email } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!otp || !newPass || !normalizedEmail) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const getUser = await userModel.findOne({ email: normalizedEmail });
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Check if OTP exists
    if (!getUser.resetOtp) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found for this user" });
    }

    // Check if OTP is expired
    if (getUser.otpExpiresAt < Date.now()) {
      // Clear expired OTP
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;
      await getUser.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Convert both OTP values to numbers for comparison
    if (Number(otp) === Number(getUser.resetOtp)) {
      const newHashedPass = await bcrypt.hash(newPass, 10);
      getUser.password = newHashedPass;

      // Clear OTP fields after successful password reset
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;

      await getUser.save();

      return res.json({
        success: true,
        message: "Password reset successfully",
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Submit OTP Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const isloggedin = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.userId)
      .select("-password -resetOtp -otpExpiresAt");

    if (!user) {
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "User not found" });
    }

    const userObj = user.toObject();

    return res.status(200).json({ isLoggedIn: true, user: userObj });
  } catch (err) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

const isAdminLoggedIn = async (req, res) => {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "No admin token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.userId)
      .select("-password -resetOtp -otpExpiresAt");

    if (!user || user.role !== 'admin') {
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "Not authorized as admin" });
    }

    const userObj = user.toObject();

    return res.status(200).json({ isLoggedIn: true, user: userObj });
  } catch (err) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

// Google OAuth Handler
const handleGoogleAuth = async (req, res) => {
  try {
    const { credential, phone, mobile, city, district, state } = req.body;
    const providedPhone = String(phone || mobile || "").trim();

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name: fullName,
      picture: profilePicture,
      email_verified,
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email not verified",
      });
    }

    // Check if user exists
    let user = await userModel.findOne({
      $or: [{ email: String(email).toLowerCase() }, { googleId: googleId }],
    });

    if (user) {
      // User exists, update Google info if needed
      if (!user.googleId) {
        await userModel.findByIdAndUpdate(user._id, {
          googleId,
          profilePicture,
          oauthProvider: "google",
          isEmailVerified: true,
        });
        user = await userModel.findById(user._id);
      }
    } else {
      if (!providedPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required for new Google signup",
        });
      }

      if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(providedPhone)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid phone number",
        });
      }

      // Create new user
      const newUserData = {
        fullName,
        email: String(email).toLowerCase(),
        phone: providedPhone,
        city: city?.trim() || undefined,
        district: district?.trim() || undefined,
        state: state?.trim() || undefined,
        googleId,
        profilePicture,
        isEmailVerified: email_verified,
        oauthProvider: "google",
      };

      user = await userModel.create(newUserData);
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Prepare user data for response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;
    delete userObj.googleId;

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      userData: userObj,
    });
  } catch (error) {
    console.error("Google authentication error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

// Update mobile number for logged-in users (e.g. after Google sign-in)
const updateMobileNumber = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { mobile, phone } = req.body;
    const resolvedPhone = String(phone || mobile || '').trim().replace(/\D/g, '');

    if (!resolvedPhone || resolvedPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
    }

    // Check if phone already taken by another user
    const existing = await userModel.findOne({ phone: resolvedPhone, _id: { $ne: decoded.userId } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This phone number is already registered' });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      decoded.userId,
      { phone: resolvedPhone },
      { new: true, runValidators: false }
    ).select('-password -resetOtp -otpExpiresAt');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Mobile number updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update mobile error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update full profile (name, phone, bank details, UPI)
const updateProfile = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const allowedFields = [
      'fullName', 'phone', 'bankAccountHolder', 'bankAccountNumber',
      'bankName', 'ifscCode'
    ];
    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      decoded.userId,
      updates,
      { new: true, runValidators: false }
    ).select('-password -resetOtp -otpExpiresAt');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
  isAdminLoggedIn,
  handleGoogleAuth,
  updateMobileNumber,
  updateProfile,
};
