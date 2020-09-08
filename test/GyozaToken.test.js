const { expectRevert } = require('@openzeppelin/test-helpers');
const GyozaToken = artifacts.require('GyozaToken');

contract('GyozaToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.gyoza = await GyozaToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.gyoza.name();
        const symbol = await this.gyoza.symbol();
        const decimals = await this.gyoza.decimals();
        assert.equal(name.valueOf(), 'GyozaToken');
        assert.equal(symbol.valueOf(), 'GYOZA');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.gyoza.mint(alice, '100', { from: alice });
        await this.gyoza.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.gyoza.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.gyoza.totalSupply();
        const aliceBal = await this.gyoza.balanceOf(alice);
        const bobBal = await this.gyoza.balanceOf(bob);
        const carolBal = await this.gyoza.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.gyoza.mint(alice, '100', { from: alice });
        await this.gyoza.mint(bob, '1000', { from: alice });
        await this.gyoza.transfer(carol, '10', { from: alice });
        await this.gyoza.transfer(carol, '100', { from: bob });
        const totalSupply = await this.gyoza.totalSupply();
        const aliceBal = await this.gyoza.balanceOf(alice);
        const bobBal = await this.gyoza.balanceOf(bob);
        const carolBal = await this.gyoza.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.gyoza.mint(alice, '100', { from: alice });
        await expectRevert(
            this.gyoza.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.gyoza.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
