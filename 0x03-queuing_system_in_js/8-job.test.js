const { expect } = require("chai");
const kue = require("kue");
const { createPushNotificationsJobs } = require("./8-job.js");
const sinon = require("sinon");

describe('createPushNotificationsJobs', () => {
    let queue;

    before(() => {
        queue = kue.createQueue();
        // Enter test mode
        queue.testMode.enter();
    });

    afterEach(() => {
        // Clear the queue after each test
        queue.testMode.clear();
    });

    after(() => {
        // Exit test mode
        queue.testMode.exit();
    });

    it('should create a job for each data object in the list', () => {
        const jobs = [
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

        const logSpy = sinon.spy(console, 'log');
        const errorSpy = sinon.spy(console, 'error');

        createPushNotificationsJobs(jobs, queue);

        const job = queue.testMode.jobs[0];

        // Simulate job events
        job.emit('progress', 50);
        job.emit('complete');
        job.emit('failed', new Error('Job failed'));

        // Verify logging
        expect(logSpy.calledWith(`Notification job created: ${job.id}`)).to.be.true;
        expect(logSpy.calledWith(`Notification job ${job.id} 50% complete`)).to.be.true;
        expect(logSpy.calledWith(`Notification job ${job.id} completed`)).to.be.true;
        expect(errorSpy.calledWith(`Notification job ${job.id} failed: Error: Job failed`)).to.be.true;

        // Restore console functions
        logSpy.restore();
        errorSpy.restore();
    });
});

