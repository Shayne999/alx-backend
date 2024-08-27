import kue from 'kue';

//creates  a queue instance
const queue = kue.createQueue();

//send a notification
function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// queue process that will listen to new jobs on push_notification_code
queue.process('push_notification_code', (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message);
    done();
});
