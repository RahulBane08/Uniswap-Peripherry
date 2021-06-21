const Router = artifacts.require("SwapRouter.sol");
const WETH = artifacts.require("WETH.sol");
const NonfungibleTokenPositionDescriptor = artifacts.require("NonfungibleTokenPositionDescriptor.sol");
const NonfungiblePositionManager = artifacts.require("NonfungiblePositionManager.sol");
const V3Migrator = artifacts.require("V3Migrator.sol");
const NFTDescriptor = artifacts.require("NFTDescriptor.sol");

module.exports = async function (deployer,network) {

    let weth;
    const FACTORY_ADDRESS = '0x0E2ce81B806385c6d9471863c0727D6dC62E57c5';

    if(network === 'mainnet'){   
        weth = await WETH.at('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
    } else {

        await deployer.deploy(WETH);
        weth = await WETH.deployed();
    }

    await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);

    await deployer.deploy(NFTDescriptor);
    
    await deployer.link(NFTDescriptor,NonfungibleTokenPositionDescriptor);

    await deployer.deploy(NonfungibleTokenPositionDescriptor, weth.address);
    nonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptor.deployed();

    await deployer.deploy(NonfungiblePositionManager, FACTORY_ADDRESS, weth.address, nonfungibleTokenPositionDescriptor.address);
    nonfungiblePositionManager = await NonfungiblePositionManager.deployed();

    await deployer.deploy(V3Migrator, FACTORY_ADDRESS, weth.address, nonfungiblePositionManager.address);
    v3Migrator = await V3Migrator.deployed();

  };
  