const { expect } = require('chai');
const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

describe('Chainify Contract', function () {
  let Chainify;
  let chainify;
  let owner;
  let buyer;
  let deployer;

  before(async function () {
    [owner, deployer, buyer] = await ethers.getSigners();
    Chainify = await ethers.getContractFactory('Chainify');
  });

  beforeEach(async function () {
    chainify = await Chainify.deploy();
  });

  it('Should set the owner correctly', async function () {
    expect(await chainify.owner()).to.equal(owner.address);
  });

  it('Should list an item', async function () {
    const ID = 1;
    const NAME = 'Shoes';
    const CATEGORY = 'Clothing';
    const IMAGE = 'https://blockworks-co.imgix.net/wp-content/uploads/2021/11/nike.jpeg';
    const COST = tokens(1)
    const RATING = 4;
    const STOCK = 5;

    await chainify.connect(owner).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

    const item = await chainify.items(ID);

    expect(item.id).to.equal(ID);
    expect(item.name).to.equal(NAME);
    expect(item.category).to.equal(CATEGORY);
    expect(item.image).to.equal(IMAGE);
    expect(item.cost).to.equal(COST);
    expect(item.rating).to.equal(RATING);
    expect(item.stock).to.equal(STOCK);
  });

  it('Should allow buying an item', async function () {
    const ID = 1;
    const NAME = 'Shoes';
    const CATEGORY = 'Clothing';
    const IMAGE = 'https://blockworks-co.imgix.net/wp-content/uploads/2021/11/nike.jpeg';
    const COST = ethers.utils.parseUnits('1', 'ether');
    const RATING = 4;
    const STOCK = 5;
  
    await chainify.connect(owner).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
  
    const initialBalanceBuyer = await ethers.provider.getBalance(buyer.address);
  
    const tx = await chainify.connect(buyer).buy(ID, { value: COST });
  
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed.mul(tx.gasPrice);
  
    const finalBalanceBuyer = await ethers.provider.getBalance(buyer.address);
  
    const order = await chainify.orders(buyer.address, 1);
  
    expect(order.item.name).to.equal(NAME);
    expect(finalBalanceBuyer).to.be.gte(initialBalanceBuyer.sub(COST).sub(gasCost));
  });
  

  it('Should allow the owner to withdraw funds', async function () {
    const ID = 1;
    const NAME = 'Shoes';
    const CATEGORY = 'Clothing';
    const IMAGE = 'https://blockworks-co.imgix.net/wp-content/uploads/2021/11/nike.jpeg';
    const COST = ethers.parseUnits('1', 'ether');
    const RATING = 4;
    const STOCK = 5;

    await chainify.connect(owner).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

    const initialBalanceOwner = await owner.getBalance();

    await chainify.connect(buyer).buy(ID, { value: COST });

    await chainify.connect(owner).withdraw();

    const finalBalanceOwner = await owner.getBalance();
    const contractBalance = await ethers.provider.getBalance(chainify.address);

    expect(finalBalanceOwner).to.be.gte(initialBalanceOwner.add(COST));
    expect(contractBalance).to.equal(0);
  });
});
