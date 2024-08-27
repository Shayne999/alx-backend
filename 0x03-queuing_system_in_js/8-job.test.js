import { expect } from "chai";
import kue from "kue";
import { createPushNotificationsJobs } from "./8-job.js";

describe('createPushNotificationsJobs', () => {
    let queue;

    before(() => {
        queue = kue.createQueue();
        //enter test mode
        queue.testMode.enter();
    });

    afterEach(() => {
        //clear the queue after each test
        queue.testMode.clear();
    });

    after(() => {
        //exit test mode
        queue.testMode.exit();
    });

    it('should create a job for each data object in the list', () => {
        const jobs =[
            { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
            { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
        ];
        createPushNotificationsJobs(jobs, queue);

        expect(queue.testMode.jobs.length).to.equal(2);
        expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
        expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]);
        expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]);
    });

    it('should log job creation, progress, completion and failure', () => {
        const jobs = [
            { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
        ];

        const consoleSpy = { log: [], error: [] };

        console.log = (message) => consoleSpy.log.push(message);
        console.error = (message) => consoleSpy.error.push(message);

        createPushNotificationsJobs(jobs, queue);

        const job = queue.testMode.jobs[0];
        job.emit('progress', 50);
        job.emit('complete');
        job.emit('failed', new Error('Job failed'));

        expect(consoleSpy.log).to.include(`Notification job created: ${job.id}`);
        expect(consoleSpy.log).to.include(`Notification job ${job.id} 50% complete`);
        expect(consoleSpy.log).to.include(`Notification job ${job.id} completed`);
        expect(consoleSpy.error).to.include(`Notification job ${job.id} failed: Error: Job failed`);
    });
});
