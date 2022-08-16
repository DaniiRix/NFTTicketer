async function main() {
  const contract = await ethers.getContractFactory("NFTicketer");

  const deployer = await contract.deploy();

  await deployer.deployed();

  console.log("Contract address:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
