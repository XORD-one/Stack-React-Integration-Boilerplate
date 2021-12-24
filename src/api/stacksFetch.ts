import { STACKS_TESTNET_URL } from '../constant';
import { Fetch } from '../native components/fetch';

const fetch = new Fetch(STACKS_TESTNET_URL);

export default fetch;
