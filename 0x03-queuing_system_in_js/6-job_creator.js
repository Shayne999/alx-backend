//creates a kue queue instance
import kue from 'kue';

const queue = kue.createQueue();

//create a job
const jobData = {
    phoneNumber: '1234567890',
    message: 'Hello, this is a test notification'
};

const job = queue.create('push_notification_code', jobData)
    .save((err) => {
        if (err) {
            console.log(`Error creating job: ${err.message}`);
        } else {
            console.log(`Notification job created: ${job.id}`);
        }
    });


//listen for job completion and failure
job.on('complete', () => {
    console.log('Notification job completed');
});

job.on('failed', () => {
    console.log('Notification job failed');
});
