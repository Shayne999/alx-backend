const kue = require("kue");

function createPushNotificationsJobs(jobs, queue) {

    //check if jobs is an array
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    jobs.forEach((jobData) => {
        const job = queue.create('push_notification_code_3', jobData);

        // Save the job to the queue and handle the 'save' callback separately
        job.save((err) => {
            if (!err) {
                console.log(`Notification job created: ${job.id}`);
            }
        });

        //job progress
        job.on('progress', (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`);
        });

        //listen for job completion and failure
        job.on('complete', () => {
            console.log(`Notification job ${job.id} completed`);
        });

        job.on('failed', (err) => {
            console.log(`Notification job ${job.id} failed: ${err}`);
        });
    });
}


module.exports = { createPushNotificationsJobs };
