import solc from "solc";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";

function findImports(importPath) {
    try {
        if (importPath.startsWith('@openzeppelin/')) {
            const npmPath = path.resolve('node_modules', importPath);
            return { contents: fs.readFileSync(npmPath, 'utf8') };
        }

        const localPath = path.resolve('contracts', importPath);
        return { contents: fs.readFileSync(localPath, 'utf8') };
    } catch (error) {
        console.error(`Error resolving import ${importPath}:`, error);
        return { error: `File not found: ${importPath}` };
    }
}

export async function deployContract({ eligibleVoters }) {
    const contractPath = path.resolve("contracts", "ElectionContract.sol");
    const source = fs.readFileSync(contractPath, "utf8");

    const input = {
        language: "Solidity",
        sources: {
            "ElectionContract.sol": {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["abi", "evm.bytecode"],
                },
            },
        },
    };

    const compiledOutput = solc.compile(JSON.stringify(input), { import: findImports });
    const output = JSON.parse(compiledOutput);

    if (output.errors) {
        const hasError = output.errors.some(error => error.severity === 'error');
        if (hasError) {
            console.error("Compilation errors:", output.errors);
            throw new Error("Solidity compilation failed");
        } else {
            console.warn("Compilation warnings:", output.errors);
        }
    }

    if (output.contracts) {
        if (output.contracts["ElectionContract.sol"]) {
        } else {
            console.error("No contracts found in ElectionContract.sol");
        }
    } else {
        console.error("No contracts in compilation output");
    }

    let contractName, abi, bytecode;

    if (output.contracts && output.contracts["ElectionContract.sol"]) {
        contractName = Object.keys(output.contracts["ElectionContract.sol"])[0];
        abi = output.contracts["ElectionContract.sol"][contractName].abi;
        bytecode = output.contracts["ElectionContract.sol"][contractName].evm.bytecode.object;
    } else {
        throw new Error("Could not find compiled contract");
    }

    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(eligibleVoters);

    await contract.waitForDeployment();

    return await contract.getAddress();
}