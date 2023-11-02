// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const {items} = require("../src/assets/items.json")
const tokens = (n) =>{
  return ethers.parseUnits(n.toString(),'ether');
}
async function main() {
  const [deployer] = await ethers.getSigners();
  const Chainify= await hre.ethers.getContractFactory("Chainify");
  const chainify= await Chainify.deploy()
  await chainify.waitForDeployment()
  console.log(`Deployed contract address : ${chainify.target}\n`)
  for(let i =0;i<items.length;i++){
    const transaction = await chainify.connect(deployer).list(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      tokens(items[i].price),
      items[i].rating,
      items[i].stock,
    )
    await transaction.wait()
    console.log(`Items ${items[i].id}: ${items[i].name}`);

  }
}
  


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});