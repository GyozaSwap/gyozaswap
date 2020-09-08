pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract GyozaBar is ERC20("GyozaBar", "xGYOZA"){
    using SafeMath for uint256;
    IERC20 public gyoza;

    constructor(IERC20 _gyoza) public {
        gyoza = _gyoza;
    }

    // Enter the bar. Pay some GYOZAs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalGyoza = gyoza.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalGyoza == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalGyoza);
            _mint(msg.sender, what);
        }
        gyoza.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your GYOZAs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(gyoza.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        gyoza.transfer(msg.sender, what);
    }
}