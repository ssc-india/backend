import request from 'supertest';

import app from '../../../app';
import { clearDB, initializeContent, signup } from '../../../test/utils';
import { Content, ContentDoc, User } from '../../../models';

describe('Test the show functionality for posts', () => {
    let testId: string = '';

    beforeAll(async () => {
        await clearDB();
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');
        const user = (await User.find())[0];
        testId = await initializeContent(user, 10);
    });

    afterAll(async () => { await clearDB() });
    
    const getIds = async (posts: ContentDoc[], params: { [key: string]: string }) => {
        const allPosts = await Content.find();
        let correctIds: string[] = [];
        let receivedIds: string[] = [];

        for (const post of allPosts) {
            let isValid = true;
            for (const key in params) {
                if (params[key] !== post.get(key)) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) correctIds.push(post.id);
        }

        receivedIds = posts.map(post => post.id);
        
        return [correctIds, receivedIds];
    }

    const haveAllIds = (correctIds: string[], receivedIds: string[]) => {
        let haveAllIds = true;
        for (const id of correctIds) {
            if (!receivedIds.includes(id)) {
                haveAllIds = false;
                break;
            }
        }

        return haveAllIds;
    }
        
    it('fetches all posts if no query parameters are specified', async () => {
        const response = await request(app)
            .get('/content/show')
            .send()
            .expect(200)

        expect(response.body.posts).toBeDefined();
        expect(response.body.posts.length).toBeDefined();
        expect(response.body.posts.length).toEqual(10);
    });

    it('fetches posts matching the provided ID', async () => {
        const response = await request(app)
            .get('/content/show')
            .query({ id: testId })
            .send()
            .expect(200)

        expect(response.body.posts).toBeDefined();
        expect(response.body.posts.length).toEqual(1);
        expect(response.body.posts[0].id).toEqual(testId);
    });

    it('fetches posts matching the provided institute', async () => {
        const institute = 'IIT Madras';
        const response = await request(app)
            .get('/content/show')
            .query({ institute })
            .send()
            .expect(200)

        expect(response.body.posts).toBeDefined();
        
        const [correctIds, receivedIds] = await getIds((response.body.posts as ContentDoc[]), { institute });
        expect(correctIds.length).toEqual(receivedIds.length);
        expect(haveAllIds(correctIds, receivedIds)).toBe(true);
    });

    it('fetches posts matching the provided branch', async () => {
        const branch = 'Physics';
        const response = await request(app)
            .get('/content/show')
            .query({ branch })
            .send()
            .expect(200)

        expect(response.body.posts).toBeDefined();
        
        const [correctIds, receivedIds] = await getIds((response.body.posts as ContentDoc[]), { branch });
        expect(correctIds.length).toEqual(receivedIds.length);
        expect(haveAllIds(correctIds, receivedIds)).toBe(true);
    });

    it('fetches posts matching the provided ID and institute', async () => {
        const institute = 'IIT Madras';
        const response = await request(app)
            .get('/content/show')
            .query({ id: testId, institute })
            .send()
            .expect(200)

        expect(response.body.posts).toBeDefined();
        
        const [correctIds, receivedIds] = await getIds((response.body.posts as ContentDoc[]), { id: testId, institute });
        expect(correctIds.length).toEqual(receivedIds.length);
        expect(haveAllIds(correctIds, receivedIds)).toBe(true);
    });

    it('fetches posts matching the provided institute and branch', async () => {
        const institute = 'IIT Madras';
        const branch = 'Physics';
        const response = await request(app)
            .get('/content/show')
            .query({ branch, institute })
            .send()
            .expect(200)

        expect(response.body.posts).toBeDefined();
        
        const [correctIds, receivedIds] = await getIds((response.body.posts as ContentDoc[]), { branch, institute });
        expect(correctIds.length).toEqual(receivedIds.length);
        expect(haveAllIds(correctIds, receivedIds)).toBe(true);
    });

    it('fetches posts matching the provided ID and branch', async () => {
        const branch = 'Physics';
        const response = await request(app)
            .get('/content/show')
            .query({ id: testId, branch })
            .send()
            .expect(200)

        expect(response.body.posts).toBeDefined();
        
        const [correctIds, receivedIds] = await getIds((response.body.posts as ContentDoc[]), { id: testId, branch });
        expect(correctIds.length).toEqual(receivedIds.length);
        expect(haveAllIds(correctIds, receivedIds)).toBe(true);
    });

    it('fetches posts matching the provided ID, institute and branch', async () => {
        const institute = 'IIT Madras';
        const branch = 'Physics';
        const response = await request(app)
            .get('/content/show')
            .query({ id: testId, branch, institute })
            .send()
            .expect(200)

        expect(response.body.posts).toBeDefined();
        
        const [correctIds, receivedIds] = await getIds((response.body.posts as ContentDoc[]), { id: testId, branch, institute });
        expect(correctIds.length).toEqual(receivedIds.length);
        expect(haveAllIds(correctIds, receivedIds)).toBe(true);
    });
});
