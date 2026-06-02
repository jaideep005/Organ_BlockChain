package com.transplantchain.service;

import com.transplantchain.contract.OrganChain;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthBlock;
import org.web3j.protocol.core.methods.response.EthBlockNumber;
import org.web3j.tx.gas.DefaultGasProvider;

import jakarta.annotation.PostConstruct;
import java.math.BigInteger;
import java.util.*;

@Service
public class BlockchainService {

    @Autowired
    private Web3j web3j;

    private OrganChain organChainContract;

    @Value("${web3.private-key}")
    private String privateKey;

    @Value("${web3.contract-address}")
    private String contractAddress;

    @PostConstruct
    public void init() {
        try {
            Credentials credentials = Credentials.create(privateKey);
            organChainContract = OrganChain.load(
                    contractAddress,
                    web3j,
                    credentials,
                    new DefaultGasProvider()
            );
            System.out.println("Blockchain Service initialized with contract: " + contractAddress);
        } catch (Exception e) {
            System.err.println("Blockchain Service init failed (Ganache may be offline): " + e.getMessage());
        }
    }

    public String registerPledge(byte[] abhaHash, byte[] documentHash, String ipfsCid, int organBitmap, byte[] witnessSignature) throws Exception {
        var receipt = organChainContract.registerPledge(
                abhaHash,
                documentHash,
                ipfsCid,
                BigInteger.valueOf(organBitmap),
                witnessSignature
        ).send();

        return receipt.getTransactionHash();
    }

    /**
     * Execute a match on the blockchain and return both txHash and blockNumber.
     */
    public Map<String, Object> executeMatchEnhanced(byte[] donorHash, byte[] recipientHash, int organId) throws Exception {
        var receipt = organChainContract.executeMatch(
                donorHash,
                recipientHash,
                BigInteger.valueOf(organId)
        ).send();

        Map<String, Object> result = new HashMap<>();
        result.put("transactionHash", receipt.getTransactionHash());
        result.put("blockNumber", receipt.getBlockNumber() != null ? receipt.getBlockNumber().longValue() : 0L);
        return result;
    }

    public String executeMatch(byte[] donorHash, byte[] recipientHash, int organId) throws Exception {
        var receipt = organChainContract.executeMatch(
                donorHash,
                recipientHash,
                BigInteger.valueOf(organId)
        ).send();

        return receipt.getTransactionHash();
    }

    /**
     * Get the latest block number from Ganache.
     */
    public long getLatestBlockNumber() {
        try {
            EthBlockNumber blockNumber = web3j.ethBlockNumber().send();
            return blockNumber.getBlockNumber().longValue();
        } catch (Exception e) {
            System.err.println("Failed to get block number: " + e.getMessage());
            return 0;
        }
    }

    /**
     * Get recent transactions from the last N blocks.
     */
    public List<Map<String, Object>> getRecentTransactions(int count) {
        List<Map<String, Object>> txList = new ArrayList<>();
        try {
            long latest = getLatestBlockNumber();
            if (latest == 0) return txList;

            long start = Math.max(0, latest - count);
            for (long i = latest; i > start && txList.size() < count; i--) {
                try {
                    EthBlock block = web3j.ethGetBlockByNumber(
                            org.web3j.protocol.core.DefaultBlockParameter.valueOf(BigInteger.valueOf(i)),
                            true
                    ).send();

                    if (block.getBlock() != null) {
                        EthBlock.Block b = block.getBlock();
                        for (EthBlock.TransactionResult<?> txResult : b.getTransactions()) {
                            EthBlock.TransactionObject tx = (EthBlock.TransactionObject) txResult;
                            Map<String, Object> txMap = new HashMap<>();
                            txMap.put("blockNumber", b.getNumber().longValue());
                            txMap.put("transactionHash", tx.getHash());
                            txMap.put("from", tx.getFrom());
                            txMap.put("to", tx.getTo());
                            txMap.put("timestamp", b.getTimestamp().longValue() * 1000);
                            txMap.put("input", tx.getInput() != null && tx.getInput().length() > 2
                                    ? tx.getInput().substring(0, Math.min(20, tx.getInput().length())) + "..."
                                    : "0x");
                            txList.add(txMap);
                        }
                        // Also add empty blocks as block-mined events
                        if (b.getTransactions().isEmpty()) {
                            Map<String, Object> blockEvent = new HashMap<>();
                            blockEvent.put("blockNumber", b.getNumber().longValue());
                            blockEvent.put("transactionHash", "BLOCK_MINED");
                            blockEvent.put("from", "MINER");
                            blockEvent.put("to", "—");
                            blockEvent.put("timestamp", b.getTimestamp().longValue() * 1000);
                            blockEvent.put("input", "0x");
                            txList.add(blockEvent);
                        }
                    }
                } catch (Exception e) {
                    // skip problematic blocks
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching recent transactions: " + e.getMessage());
        }
        return txList;
    }
}
