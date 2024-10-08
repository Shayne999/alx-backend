import kue from 'kue';

//creates  a queue instance
const queue = kue.createQueue();

const blacklist = ['4153518780', '4153518781'];

//excludes the blacklisted phone numbers
function sendNotification(phoneNumber, message, job, done) {
    //tracking job progress at 0%
    job.progress(0, 100);

    if (blacklist.includes(phoneNumber)){
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }

    //tracking job progress at 50%
    job.progress(50, 100);

    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
}

queue.process('push_notification_code_2', 2, (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message, job, done);
});
