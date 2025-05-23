import { ethers} from "ethers";

console.log("ECDSAInvalidSignature:", ethers.id("ECDSAInvalidSignature()").slice(0, 10));
console.log("ECDSAInvalidSignatureLength:", ethers.id("ECDSAInvalidSignatureLength(uint256)").slice(0, 10));
console.log("ECDSAInvalidSignatureS:", ethers.id("ECDSAInvalidSignatureS(bytes32)").slice(0, 10));
console.log("OwnableInvalidOwner:", ethers.id("OwnableInvalidOwner(address)").slice(0, 10));
console.log("OwnableUnauthorizedAccount:", ethers.id("OwnableUnauthorizedAccount(address)").slice(0, 10));
console.log("ReentrancyGuardReentrantCall:", ethers.id("ReentrancyGuardReentrantCall()").slice(0, 10));