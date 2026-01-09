package com.jobchain.service;

import com.jobchain.contract.JobChainContract;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlockchainService {

    private final JobChainContract contract;
    private final Web3j web3j;
    private final Credentials credentials;

    public TransactionReceipt createVacancyAndReturnReceipt(
            String title,
            int totalPosts,
            String paperHash
    ) throws Exception {

        byte[] hashBytes = Numeric.hexStringToByteArray("0x" + paperHash);

        return contract.createVacancy(
                title,
                BigInteger.valueOf(totalPosts),
                hashBytes
        ).send();
    }

    public Long extractVacancyId(TransactionReceipt receipt) {

        List<JobChainContract.VacancyCreatedEventResponse> events =
                contract.getVacancyCreatedEvents(receipt);

        if (events.isEmpty()) {
            throw new IllegalStateException("VacancyCreated event not emitted");
        }

        return events.get(0).vacancyId.longValue();
    }

    public String logApplicationOnChain(Long vacancyId, String appHash)
            throws Exception {

        byte[] hashBytes = Numeric.hexStringToByteArray("0x" + appHash);

        TransactionReceipt receipt =
                contract.logApplication(
                        BigInteger.valueOf(vacancyId),
                        hashBytes
                ).send();

        return receipt.getTransactionHash();
    }

    public String recordExamScoreOnChain(
            Long vacancyId,
            int marks,
            String markingHash
    ) throws Exception {

        byte[] hashBytes = Numeric.hexStringToByteArray("0x" + markingHash);

        TransactionReceipt receipt =
                contract.recordExamScore(
                        BigInteger.valueOf(vacancyId),
                        BigInteger.valueOf(marks),
                        hashBytes
                ).send();

        return receipt.getTransactionHash();
    }

    public String publishMeritOnChain(Long vacancyId, String meritHash)
            throws Exception {

        byte[] hashBytes = Numeric.hexStringToByteArray("0x" + meritHash);

        TransactionReceipt receipt =
                contract.publishMerit(
                        BigInteger.valueOf(vacancyId),
                        hashBytes
                ).send();

        return receipt.getTransactionHash();
    }

    public String detectPaperLeakOnChain(
            Long vacancyId,
            int suspectCount,
            String patternHash
    ) throws Exception {

        byte[] hashBytes = Numeric.hexStringToByteArray("0x" + patternHash);

        TransactionReceipt receipt =
                contract.detectPaperLeak(
                        BigInteger.valueOf(vacancyId),
                        BigInteger.valueOf(suspectCount),
                        hashBytes
                ).send();

        return receipt.getTransactionHash();
    }

    public String distributePaperOnChain(
            Long blockchainVacancyId,
            String setId,
            String paperHash
    ) throws Exception {

        byte[] hashBytes = Numeric.hexStringToByteArray("0x" + paperHash);

        TransactionReceipt receipt =
                contract.distributePaper(
                        BigInteger.valueOf(blockchainVacancyId),
                        setId,
                        hashBytes
                ).send();

        return receipt.getTransactionHash();
    }

    public boolean hasEnoughBalanceForPaperSets(
            int numberOfSets,
            BigInteger gasPrice,
            BigInteger gasLimitPerTx
    ) throws Exception {

        BigInteger balance =
                web3j.ethGetBalance(
                        credentials.getAddress(),
                        DefaultBlockParameterName.LATEST
                ).send().getBalance();

        BigInteger required =
                gasPrice
                        .multiply(gasLimitPerTx)
                        .multiply(BigInteger.valueOf(numberOfSets));

        return balance.compareTo(required) >= 0;
    }

    public String recordOmrScanOnChain(String omrHash, String qrHash) throws Exception {

        byte[] omrHashBytes = omrHash.startsWith("0x") ?
                Numeric.hexStringToByteArray(omrHash) :
                Numeric.hexStringToByteArray("0x" + omrHash);

        byte[] qrHashBytes = qrHash.startsWith("0x") ?
                Numeric.hexStringToByteArray(qrHash) :
                Numeric.hexStringToByteArray("0x" + qrHash);

        TransactionReceipt receipt = contract.recordOMRScan(omrHashBytes, qrHashBytes).send();

        return receipt.getTransactionHash();
    }
}
