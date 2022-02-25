const ethers = require("ethers");

class Contract {
	constructor(artifact, network, msgSender) {
		this.artifact = artifact;
		this.address = artifact.body.addresses[network];
		this.network = network;
		this.msgSender = msgSender;
		this.provider = new ethers.providers.InfuraProvider(network, process.env.INFURA);
		this.privateKey = msgSender.body.privateKey;
		// if (msgSender.user_id === process.env.locked_user_id) {
		// 	this.privateKey = process.env.privateKey;
		// }
		this.wallet = new ethers.Wallet(this.privateKey, this.provider);
		this.ethersContract = new ethers.Contract(this.address, artifact.body.abi, this.wallet);
		this.overrides = {
			gasLimit: 200000,
			gasPrice: ethers.utils.parseUnits('20.0', 'gwei'),
		};
		this.result = {};
	}

	isValid(preTimeout, timeoutSeconds) {
		let expired = this.timeoutTimer.read() >= timeoutSeconds;
		if (preTimeout && !expired) {
			return true;
		}
		if (!preTimeout && expired) {
			return true;
		}
		return false;
	}

	async balanceOf(address) {
		let balanceInWei = await this.ethersContract.balanceOf(address);
		let wei = parseInt(balanceInWei._hex);
		let eth = wei * 0.000000000000000001;
		let balance = eth * (10 ** (18 - this.artifact.body.decimals));
		let result = Math.round(balance * 100) / 100;
		return result;
	}

	async getBalance(address) {
		let balanceInWei = await this.provider.getBalance(address);
		let wei = parseInt(balanceInWei._hex);
		let eth = wei * 0.000000000000000001;
		let result = Math.round(eth * 100) / 100;
		return result;
	}

	async run( method, args) {
	//	let { method, args } = tx;
		console.log(method);
		let ethersTx = this.ethersContract[method];
		let signedTx = await ethersTx(...args, this.overrides);
		let result = 	await signedTx.wait();
		return result;
	}

}

module.exports = Contract;
