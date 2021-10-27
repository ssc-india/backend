import request from 'supertest';
import app from '../../../app';
import { clearDB, signup, checkErrors } from '../../../test/utils';
import { PendingVerification } from '../../../models/PendingVerification';
import { ErrorType } from '../../../errors/errorType';
import mongoose from 'mongoose';

describe('Test the email verification functionality', () => {
    let testId: string = '';

    beforeAll(async () => {
        await clearDB();
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nktest@test.com', 'password');
        const newVerificationEntry = (await PendingVerification.find())[0];
        testId = newVerificationEntry.get('_id');
    });

    afterAll(async () => { await clearDB() });

    it('fails if no pending verification exists for supplied ID', async () => {
        const response = await request(app)
            .post('/auth/verify_email')
            .send({ id: (new mongoose.Types.ObjectId()).toString('hex') })
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Invalid verification link']);
    });
    
    const modifyVerificationEntry = async (id: string, field: string, newValue: any) => { 
        const verificationEntry = await PendingVerification.findById(id);
        expect(verificationEntry).toBeDefined();

        const currentValue = verificationEntry!.get(field);
        verificationEntry!.set(field, newValue);
        await verificationEntry!.save();

        return [verificationEntry, currentValue];
    }

    const resetVerificationEntry = async (verificationEntry: any, field: string, value: any) => {
        verificationEntry.set(field, value);
        await verificationEntry.save();
    }

    it('fails if the link has expired', async () => {
        const [verificationEntry, currentTimestamp] = await modifyVerificationEntry(testId, 'timestamp', (new Date(new Date().getTime() - 25 * 60 * 60 * 1000)));

        const response = await request(app)
            .post('/auth/verify_email')
            .send({ id: testId })
            .expect(403)
        
        checkErrors((response.body.errors as ErrorType[]), 1, ['The verification link has expired']);
        
        await resetVerificationEntry(verificationEntry, 'timestamp', currentTimestamp);
    });

    it('fails if the user corresponding to the supplied ID does not exist', async () => {
        const [verificationEntry, currentUserId] = await modifyVerificationEntry(testId, 'userId', (new mongoose.Types.ObjectId()).toString('hex'));

        const response = await request(app)
            .post('/auth/verify_email')
            .send({ id: testId })
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Invalid user']);

        await resetVerificationEntry(verificationEntry, 'userId', currentUserId);
    });

    it('sets the user as being verified and deletes the verification entry', async () => {
        await request(app)
            .post('/auth/verify_email')
            .send({ id: testId })
            .expect(200);
        
        const verificationEntry = await PendingVerification.findById(testId);
        expect(verificationEntry).toBeNull();
    });
})
