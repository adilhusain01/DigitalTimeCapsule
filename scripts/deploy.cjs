const hre = require('hardhat');

async function main() {
  try {
    // Get the contract factory
    const DigitalTimeCapsule = await hre.ethers.getContractFactory(
      'DigitalTimeCapsule'
    );

    // Deploy the contract
    console.log('Deploying DigitalTimeCapsule contract...');
    const digitalTimeCapsule = await DigitalTimeCapsule.deploy();

    // Wait for deployment to finish
    // await digitalTimeCapsule.waitForDeployment();
    const contractAddress = await digitalTimeCapsule.address;

    console.log('DigitalTimeCapsule contract deployed to:', contractAddress);
    console.log('Save this address for interaction script!');
  } catch (error) {
    console.error('Error during deployment:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
