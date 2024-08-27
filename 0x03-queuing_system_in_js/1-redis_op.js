//connects to the redis server on the local machine
import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});


//set in Redis the value for the key schoolName
function setNewSchool(schoolName, value) {
    client.set(schoolName, value, redis.print);
}

//logs the value of the key passed as an argument
function displaySchoolValue(schoolName) {
    client.get(schoolName, (err, value) => {
        console.log(value);
    });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
