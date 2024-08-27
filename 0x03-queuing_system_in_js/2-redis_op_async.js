//connects to the redis server on the local machine
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});


// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


//set in Redis the value for the key schoolName
async function setNewSchool(schoolName, value) {
    try{
        await setAsync(schoolName, value);
        console.log(`Reply: OK`);

    } catch (err) {
        console.error(`Error setting value: ${err.message}`);
    }
}

//logs the value of the key passed as an argument
async function displaySchoolValue(schoolName) {
    try{
        const value  = await getAsync(schoolName);
        console.log(value);
    } catch (err) {
        console.error(`Error getting value: ${err.message}`);
    }
}

(async () => {
    displaySchoolValue('Holberton');
    setNewSchool('HolbertonSanFrancisco', '100');
    displaySchoolValue('HolbertonSanFrancisco');
})();
