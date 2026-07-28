const OrganChain = artifacts.require("OrganChain");

contract("OrganChain", (accounts) => {
    const [admin1, admin2, admin3, user1, user2] = accounts;
    let contract;
    beforeEach(async () => {
        contract = await OrganChain.new([admin1, admin2, admin3]);
    });

    it("should reject duplicate admins", async () => {
        try {
            await OrganChain.new([admin1, admin1, admin2]);

            assert.fail("Deployment should fail");
        } catch (err) {
            assert(err.message.includes("Duplicate admin"));
        }
    });

    it("should reject zero admin", async () => {
        try {
            await OrganChain.new([
                admin1,
                admin2,
                "0x0000000000000000000000000000000000000000",
            ]);

            assert.fail();
        } catch (err) {
            assert(err.message.includes("Invalid admin address"));
        }
    });

    it("should reject duplicate pledge", async () => {
        const hash = web3.utils.keccak256("abha");

        await contract.registerPledge(
            hash,
            web3.utils.keccak256("doc"),
            "cid",
            1,
            "0x1234",
        );

        try {
            await contract.registerPledge(
                hash,
                web3.utils.keccak256("doc2"),
                "cid2",
                1,
                "0x1234",
            );

            assert.fail();
        } catch (err) {
            assert(err.message.includes("Pledge already exists"));
        }
    });

    it("should reject empty CID", async () => {
        try {
            await contract.registerPledge(
                web3.utils.keccak256("abha"),
                web3.utils.keccak256("doc"),
                "",
                1,
                "0x1234",
            );

            assert.fail();
        } catch (err) {
            assert(err.message.includes("IPFS CID required"));
        }
    });

    it("should reject empty witness signature", async () => {
        try {
            await contract.registerPledge(
                web3.utils.keccak256("abha"),
                web3.utils.keccak256("doc"),
                "cid",
                1,
                "0x",
            );

            assert.fail();
        } catch (err) {
            assert(err.message.includes("Witness signature required"));
        }
    });

    it("should reject self match", async () => {
        const hash = web3.utils.keccak256("user");

        await contract.registerPledge(
            hash,
            web3.utils.keccak256("doc"),
            "cid",
            1,
            "0x1234",
        );

        try {
            await contract.executeMatch(hash, hash, 0, { from: admin1 });

            assert.fail();
        } catch (err) {
            assert(err.message.includes("Donor and recipient cannot be the same"));
        }
    });

    it("should reject invalid organ id", async () => {
        const donor = web3.utils.keccak256("donor");
        const recipient = web3.utils.keccak256("recipient");

        await contract.registerPledge(
            donor,
            web3.utils.keccak256("doc1"),
            "cid1",
            255,
            "0x1234",
        );

        await contract.registerPledge(
            recipient,
            web3.utils.keccak256("doc2"),
            "cid2",
            255,
            "0x1234",
        );

        try {
            await contract.executeMatch(donor, recipient, 8, { from: admin1 });

            assert.fail();
        } catch (err) {
            assert(err.message.includes("Invalid organ ID"));
        }
    });

    it("should register valid pledge", async () => {
        await contract.registerPledge(
            web3.utils.keccak256("abha"),
            web3.utils.keccak256("doc"),
            "cid",
            1,
            "0x1234",
        );

        const pledge = await contract.pledges(web3.utils.keccak256("abha"));

        assert.equal(pledge.ipfsCid, "cid");
    });

    it("should execute valid match", async () => {
        const donor = web3.utils.keccak256("donor");
        const recipient = web3.utils.keccak256("recipient");

        await contract.registerPledge(
            donor,
            web3.utils.keccak256("doc1"),
            "cid1",
            1,
            "0x1234",
        );

        await contract.registerPledge(
            recipient,
            web3.utils.keccak256("doc2"),
            "cid2",
            1,
            "0x1234",
        );

        await contract.executeMatch(donor, recipient, 0, { from: admin1 });
        const donorPledge = await contract.pledges(donor);
        assert.equal(donorPledge.isMatched, true);
    });
});
