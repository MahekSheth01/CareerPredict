import dotenv from 'dotenv';
import { sendVerificationEmail } from './utils/emailService.js';

dotenv.config();

async function test() {
    try {
        console.log('Testing sendVerificationEmail with actual service...');
        await sendVerificationEmail('digitalsociety14@gmail.com', 'Test User', 'test-token-123');
        console.log('✅ sendVerificationEmail finished successfully');
    } catch (error) {
        console.error('❌ sendVerificationEmail failed:', error);
    }
}

test();
