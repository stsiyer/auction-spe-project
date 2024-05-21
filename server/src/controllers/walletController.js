const User = require("../models/User");

const addToWallet=async(req,res)=>{
    const {money}=req.body;
    if(money<1){
        return res.status(404).json({ message: "Money should be above Rs 1" });
    }
    try {
        const user=await User.findById(req.user);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        user.wallet+=money;
        user.save();
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }

};
module.exports={addToWallet};