import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utills/generateToken.js";
import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";
import sodium from "libsodium-wrappers";
import e from "express";

dotenv.config();

export const signup = async (req, res) => {
    try {
      const { fullName, password, confirmPassword, email, contact } = req.body;
  
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const username = fullName.toLowerCase().replace(/\s+/g, "");
      const otp = String(Math.floor(100000 + Math.random() * 900000));
  
      await sodium.ready;
      const keyPair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_hex(keyPair.publicKey);
      const privateKey = sodium.to_hex(keyPair.privateKey);
  
      console.log("Generated Client Public Key:", publicKey);
      console.log("Generated Client Private Key:", privateKey);
  
      const newUser = new User({
        fullName,
        username,
        password: hashedPassword,
        role: "client",
        email,
        contact,
        verifyotp: otp,
        verifyOtpExpires: Date.now() + 2 * 60 * 1000,
        publicKey,
        privateKey,
      });
  
      await newUser.save();
      const savedUser = await User.findById(newUser._id);
  
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to LawLink LK - Verify your email",
        html: `
            <            <div style="text-align: center; margin: 10px 0;">
            <img src="https://i.ibb.co/ZzLt5C6V/img1.png" 
                alt="LawLink LK Header Image" 
                style="max-width: 100%; max-width: 640px; height: auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        </div>

        <div style="background-color:rgb(232, 250, 255); padding: 40px 20px; font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
           
            <div >
                <h2 style="color: #1e90ff; font-size: 28px;">Hi ${newUser.fullName},</h2>
                <p style="font-size: 16px; color: #555;">
                    Welcome to <b>LawLink LK!</b><br>
                    Thank you for registering with us. To complete the account creation process, please use the OTP below:
                </p>
                <div style="font-size: 32px; font-weight: bold; color:rgb(81, 0, 255); background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    ${otp}
                </div>
                <p style="font-size: 14px; color: #777;">
                    This OTP will expire in <strong>2 minutes</strong> After that, it will expire, and you will need to request a new one.
                </p>
    
                <p style="font-size: 14px; color: #777; margin-top: 20px; ">
                    <b>How to verify:</b><br>
                    1. Enter the OTP in the verification field.<br>
                    2. Complete the process to finish verifying your account.
                </p>
    
                <p style="font-size: 14px; color: #555; margin-top: 20px;">
                    If you didn’t request this, please ignore this email. Your account remains safe.
                </p>
    
                <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                    <p style="font-size: 16px; color: #555;">
                        If you need further assistance, contact us at
                        <a href="mailto:lawlinklk@gmail.com" style="color: #1e90ff; text-decoration: none;">lawlinklk@gmail.com</a>.
                    </p>
                    <p style="font-size: 14px; color: #777;">Best regards,<br><b>LawLink LK Team</b><br>
                  
                        Visit us at <a href="https://www.lawlinklk.com" style="color: #1e90ff; text-decoration: none;">www.lawlinklk.com</a>
                    </p>
                </div>
    
                <img src="https://i.ibb.co/Rp8Y415s/lawlink-hori-copy.png" alt="LawLink LK" style="width: 200px; margin-top: 20px;">
            </div>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);
  
      res.status(201).json({
        _id: savedUser._id,
        fullName: savedUser.fullName,
        username: savedUser.username,
        msg: "User created successfully. Please check your email for the OTP.",
      });
    } catch (err) {
      console.error("Error in signup controller:", err.message);
      res.status(500).json({ msg: "Something went wrong" });
    }
  };


export const login = async(req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ msg: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        generateToken(user._id, res);   

        if(!user.isVerified){
            return res.status(400).json({ msg: "User does not verified" });
        }

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            msg: "Logged in successfully",
        });
    }
    catch(err){
        console.error("Error in login controller:", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }   
    
};

export const logout = (req, res) => {
    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true, // Match generateToken settings
        sameSite: "none", // Match generateToken settings
        path: "/", // Match generateToken settings
      });
      res.status(200).json({ msg: "Logged out successfully" });
    } catch (err) {
      console.error("Error in logout controller:", err.message);
      res.status(500).json({ msg: "Something went wrong" });
    }
  };

export const sendVerifyOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: "Missing email" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 2 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome to LawLink LK - Verify your email - New OTP",
            html: `
             <            <div style="text-align: center; margin: 10px 0;">
                <img src="https://i.ibb.co/ZzLt5C6V/img1.png" 
                    alt="LawLink LK Header Image" 
                    style="max-width: 100%; max-width: 640px; height: auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            </div>

            <div style="background-color:rgb(232, 250, 255); padding: 40px 20px; font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
               
                <div >
                    <h2 style="color: #1e90ff; font-size: 28px;">Hi ${user.fullName},</h2>
                    <p style="font-size: 16px; color: #555;">
                        Welcome to <b>LawLink LK!</b><br>
                        Here is your new one-time password (OTP) for account creation process:
                    </p>
                    <div style="font-size: 32px; font-weight: bold; color:rgb(81, 0, 255); background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #777;">
                        This OTP will expire in <strong>5 minutes</strong> After that, it will expire, and you will need to request a new one.
                    </p>
        
                    <p style="font-size: 14px; color: #777; margin-top: 20px; ">
                        <b>How to verify:</b><br>
                        1. Enter the OTP in the verification field.<br>
                        2. Complete the process to finish verifying your account.
                    </p>
        
                    <p style="font-size: 14px; color: #555; margin-top: 20px;">
                        If you didn’t request this, please ignore this email. Your account remains safe.
                    </p>
        
                    <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                        <p style="font-size: 16px; color: #555;">
                            If you need further assistance, contact us at
                            <a href="mailto:lawlinklk@gmail.com" style="color: #1e90ff; text-decoration: none;">lawlinklk@gmail.com</a>.
                        </p>
                        <p style="font-size: 14px; color: #777;">Best regards,<br><b>LawLink LK Team</b><br>
                      
                            Visit us at <a href="https://www.lawlinklk.com" style="color: #1e90ff; text-decoration: none;">www.lawlinklk.com</a>
                        </p>
                    </div>
        
                    <img src="https://i.ibb.co/Rp8Y415s/lawlink-hori-copy.png" alt="LawLink LK" style="width: 200px; margin-top: 20px;">
                </div>
            </div>
            `,
        };
        
        await transporter.sendMail(mailOptions);
        

        res.status(200).json({ msg: "Otp sent successfully" });
       

    }catch(error){
        console.error("Error in sendRestPasswordOtp controller:", error.message);
        res.status(500).json({msg: "Something went wrong"});
    }
};

export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    console.log("Request Body:", req.body);
  
    if (!email || !otp) {
      return res.status(400).json({ msg: "Missing email or otp" });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }
  
      if (user.verifyotp !== otp) {
        return res.status(400).json({ msg: "Invalid otp" });
      }
  
      if (user.verifyOtpExpires < Date.now()) {
        return res.status(400).json({ msg: "Otp has expired" });
      }
  
      user.isVerified = true;
      user.verifyotp = '';
      user.verifyOtpExpires = 0;
  
      await user.save();
  
      res.status(200).json({ msg: "User is authenticated" });
    } catch (err) {
      console.error("Error in verifyEmail controller:", err.message);
      res.status(500).json({ msg: "Something went wrong" });
    }
  };


export const sendRestPasswordOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: "Missing email" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 2 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Reset your password",
            html: `
             <div style="text-align: center; margin: 10px 0;">
                <img src="https://i.ibb.co/ZzLt5C6V/img1.png" 
                    alt="LawLink LK Header Image" 
                    style="max-width: 100%; max-width: 640px; height: auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            </div>

            <div style="background-color:rgb(239, 247, 249); padding: 40px 20px; font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center;">
                    <h2 style="color:rgb(2, 30, 57); font-size: 28px;">Hi ${user.fullName},</h2>
                    <p style="font-size: 16px; color: #555;">
                        We received a request to reset your password. To proceed, please use the OTP below:
                    </p>
                    <div style="font-size: 32px; font-weight: bold; color:rgb(0, 8, 255); background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #777;">
                        This OTP will expire in <strong>2 minutes</strong>. Please use it before it expires.
                    </p>
        
                    <p style="font-size: 14px; color: #777; margin-top: 20px;">
                        <b>How to reset your password:</b><br>
                        1. Enter the OTP in the reset password field.<br>
                        2. Choose your new password and complete the process.
                    </p>
        
                    <p style="font-size: 14px; color: #555; margin-top: 20px;">
                        If you didn’t request a password reset, please ignore this email. Your account remains safe.
                    </p>
        
                    <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                        <p style="font-size: 16px; color: #555;">
                            For any help, contact our support team at
                            <a href="mailto:lawlinklk@gmail.com" style="color: #1e90ff; text-decoration: none;">lawlinklk@gmail.com</a>.
                        </p>
                        <p style="font-size: 14px; color: #777;">Best regards,<br><b>LawLink LK Team</b><br>
                      
                            Visit us at <a href="https://www.lawlinklk.com" style="color: #1e90ff; text-decoration: none;">www.lawlinklk.com</a>
                        </p>
                    </div>
        
                    <img src="https://i.ibb.co/Rp8Y415s/lawlink-hori-copy.png" alt="LawLink LK" style="width: 200px; margin-top: 20px;">
                </div>
            </div>
            `,
        };
        
        await transporter.sendMail(mailOptions);
        

        res.status(200).json({ msg: "Otp sent successfully" });
       

    }catch(error){
        console.error("Error in sendRestPasswordOtp controller:", error.message);
        res.status(500).json({msg: "Something went wrong"});
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp ) {
        return res.status(400).json({ msg: "Missing fields" });
    }

    

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User does not found" });
        }

        if (user.resetOtp !== otp || user.resetOtp === '') {
            return res.status(400).json({ msg: "Invalid otp" });
        }

        if (user.resetOtpExpires < Date.now()) {
            return res.status(400).json({ msg: "Otp has expired" });
        }

      

    } catch (err) {
        console.error("Error in resetPassword controller:", err.message);
        res.status(500).json({ msg: "Something went wrong" });
        }
        
    }

export const newPassword = async (req, res) => {
        try {
            const { email, newPassword } = req.body;
            
            if (!email || !newPassword) {
                return res.status(400).json({ msg: "Missing required fields" });
            }
    
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(400).json({ msg: "User not found" });
            }
    
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            user.password = hashedPassword;
            user.resetOtp = '';
            user.resetOtpExpires = 0;
    
            await user.save();
    
            res.status(200).json({ msg: "Password reset successfully" });
        } catch (error) {
            console.error("Error in newPassword controller:", error);
            res.status(500).json({ msg: "Something went wrong" });
        }
    };