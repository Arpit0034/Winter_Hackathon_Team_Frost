package com.jobchain.config;
package com.jobchain.config;

import com.jobchain.contract.JobChainContract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.Keys;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.StaticGasProvider;

import java.math.BigInteger;

@Configuration
public class BlockchainConfig {

    private static final long AMOY_CHAIN_ID = 80002;

    @Value("${blockchain.rpc.url}")
    private String rpcUrl;

    @Value("${blockchain.private.key}")
    private String privateKey;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(rpcUrl));
    }

    @Bean
    public Credentials credentials() {
        return Credentials.create(privateKey);
    }

    @Bean
    public TransactionManager web3TransactionManager(
            Web3j web3j,
            Credentials credentials
    ) {
        return new RawTransactionManager(
                web3j,
                credentials,
                AMOY_CHAIN_ID
        );
    }

    @Bean
    public JobChainContract jobChainContract(
            Web3j web3j,
            TransactionManager web3TransactionManager
    ) {
        StaticGasProvider gasProvider =
                new StaticGasProvider(
                        BigInteger.valueOf(30_000_000_000L),
                        BigInteger.valueOf(1_500_000)
                );

        return JobChainContract.load(
                Keys.toChecksumAddress(contractAddress),
                web3j,
                web3TransactionManager,
                gasProvider
        );
    }
}
