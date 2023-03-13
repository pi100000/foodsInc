import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.REACT_PB_URL);

export default pb;