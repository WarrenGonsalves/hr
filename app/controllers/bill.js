var Bill = require('../models/Bill');

exports.getBills = function(req, res) {
  Bill.find(function (err, bills) {
    if (err) {
      return res.status(400).send({message: err});
    }
    return res.status(200).send(bills);
  })
}

exports.addBill = function (req, res) {
  if (!req.body.paidTo) return res.status(400).send({message: "Need bill paidTo data"});
  if (!req.body.date) return res.status(400).send({message: "Need bill date"});
  if (!req.body.amount || req.body.amount <= 0) return res.status(400).send({message: "Bill amount invalid"});
  
  var newBill = new Bill({
    paidTo: req.body.paidTo,
    date: req.body.date,
    amount: req.body.amount,
    category: req.body.category,
    status: req.body.status  
  })

  newBill.save(function (err, newBill) {
    if (err) {
      return res.status(400).send({message: err})
    }
    return res.status(200).send(newBill);
  })
  
}

exports.deleteBill = function (req, res) {
  if (!req.params.billId) return res.status(400).send({message: "Need bill Id"})

  Bill.findById(req.params.billId).remove().exec( function (err, bill) {
    if (err) {
      return res.status(400).send({message: err})
    }
    return res.status(200).send({message: "Bill id:" +bill._id + " deleted."})
  })
  
}