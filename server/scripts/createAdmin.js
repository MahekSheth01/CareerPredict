import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        const adminData = {
            name: 'Admin User',
            email: 'admin@careerpredict.com',
            password: 'Admin@123',
            role: 'admin',
            isVerified: true,
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`📧 Email: ${adminData.email}`);
            console.log(`🔑 Password: Admin@123`);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create(adminData);
        console.log('\n🎉 Admin account created successfully!\n');
        console.log('📋 Login Credentials:');
        console.log(`📧 Email: ${adminData.email}`);
        console.log(`🔑 Password: ${adminData.password}`);
        console.log('\n⚠️  Please change the password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
