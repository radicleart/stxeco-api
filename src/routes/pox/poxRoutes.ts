import express from "express";
import { findRewardSlotByAddress, findRewardSlotByAddressMinHeight, findRewardSlotByCycle, getRewardsByAddress, readAllRewardSlots, readRewardSlots } from "./reward_slot_helper.js";
import { collateStackerInfo, extractAllPoxEntriesInCycle, findPoxEntriesByAddress, findPoxEntriesByAddressAndCycle, findPoxEntriesByCycle, getAddressFromHashBytes, getHashBytesFromAddress, readPoxEntriesFromContract, readSavePoxEntries } from "./pox_helper.js";
import { getAllowanceContractCallers, getPoxBitcoinAddressInfo, getPoxCycleInfo, getPoxInfo, getStackerInfoFromContract, getRewardSetPoxAddress } from "./pox_contract_helper.js";
import { readDelegationEvents } from "./delegation_helper.js";
import { findPoolStackerEventsByDelegator, findPoolStackerEventsByHashBytes, findPoolStackerEventsByStacker, findPoolStackerEventsByStackerAndEvent, readPoolStackerEvents } from "./pool_stacker_events_helper.js";
import { getConfig } from "../../lib/config.js";

const router = express.Router();

router.get("/info", async (req, res, next) => {
  try {
    const response = await getPoxInfo();
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/info/cycle/:cycle", async (req, res, next) => {
  try {
    const cycleInfo = await getPoxCycleInfo(Number(req.params.cycle));
    return res.send(cycleInfo);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/sync/delegation-events/:poolPrincipal/:offset/:limit", async (req, res, next) => {
  try {
    const response = await readDelegationEvents(req.params.poolPrincipal, Number(req.params.offset), Number(req.params.limit));
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/sync/reward-slots", async (req, res, next) => {
  try {
    const response = await readAllRewardSlots();
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/get-allowance-contract-callers/:address/:contract", async (req, res, next) => {
  try {
    const response = await getAllowanceContractCallers(req.params.address, req.params.contract);
    console.log(response)
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/stacker-info/:address", async (req, res, next) => {
  try {
    const poxInfo = await getPoxInfo()
    const response = await collateStackerInfo(req.params.address, poxInfo.current_cycle.id);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/stacker-info/:address/:cycle", async (req, res, next) => {
  try {
    const response = await collateStackerInfo(req.params.address, Number(req.params.cycle));
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/pox-entries/:bitcoinAddress", async (req, res, next) => {
  try {
    const response = await findPoxEntriesByAddress(req.params.bitcoinAddress);
    console.log(response)
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/pox-entries/:bitcoinAddress/:cycle", async (req, res, next) => {
  try {
    const response = await extractAllPoxEntriesInCycle(req.params.bitcoinAddress, Number(req.params.cycle));
    console.log(response)
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/solo-stacker/:btcAddress/:cycle/:sender", async (req, res, next) => {
  try {
    const btcAddress = req.params.btcAddress
    let response:any = {};
    response = await getPoxBitcoinAddressInfo(btcAddress, Number(req.params.cycle), req.params.sender);
    console.log(response)
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/stacker/:stxAddress/:cycle", async (req, res, next) => {
  try {
    const stxAddress = req.params.stxAddress
    let response:any = {};
    response = await getStackerInfoFromContract(stxAddress, Number(req.params.cycle));
    response.cycleInfo = await getPoxCycleInfo(Number(req.params.cycle));
    console.log(response)
    return res.send(response);
  } catch (error) {
    console.error('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/reward-slot/:address/least-recent", async (req, res, next) => {
  try {
    const response = await findRewardSlotByAddressMinHeight(req.params.address);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/reward-slot/:address", async (req, res, next) => {
  try {
    const response = await findRewardSlotByAddress(req.params.address);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});

router.get("/sync/reward-slots/:offset/:limit", async (req, res, next) => {
  try {
    const poxInfo = await getPoxInfo()
    const response = await readRewardSlots(Number(req.params.offset), Number(req.params.limit), poxInfo);
    return res.send(response);
  } catch (error) {
    console.error('Error in routes: ', error)
    next('An error occurred fetching sbtc data.') 
  }
});

router.get("/reward-slots/:address/:offset/:limit", async (req, res, next) => {
  try {
    const response = await getRewardsByAddress(Number(req.params.offset), Number(req.params.limit), req.params.address);
    return res.send(response);
  } catch (error) {
    console.error('Error in routes: ', error)
    next('An error occurred fetching sbtc data.') 
  }
});

router.get("/sync/pox-entries/:cycle", async (req, res, next) => {
  try {
    const response = await readPoxEntriesFromContract(Number(req.params.cycle));
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
});
router.get("/pox-entry/:cycle/:index", async (req, res, next) => {
  try {
    const cycle = Number(req.params.cycle)
    const index = Number(req.params.index)
    const response = await readSavePoxEntries(cycle, index + 1, index);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.')
  }
});
router.get("/sync/pox-entries/:cycle/:index", async (req, res, next) => {
  try {
    const cycle = Number(req.params.cycle)
    const index = Number(req.params.index)
    const response = await readSavePoxEntries(cycle, index + 1, index);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching pox-info.') 
  }
});


router.get("/decode/:address", async (req, res, next) => {
  try {
    const response = await getHashBytesFromAddress(req.params.address);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
});

router.get("/encode/:version/:hashBytes", async (req, res, next) => {
  try {
    const response = await getAddressFromHashBytes(req.params.hashBytes, req.params.version);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
});

router.get("/reward-slots/:cycle", async (req, res, next) => {
  try {
    const response = await findRewardSlotByCycle(Number(req.params.cycle));
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
});

router.get("/pox-entries/:cycle", async (req, res, next) => {
  try {
    const response = await findPoxEntriesByCycle(Number(req.params.cycle));
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
});

router.get("/stacker-events-by-hashbytes/:hashBytes/:page/:limit", async (req, res, next) => {
  try {
    const response = await findPoolStackerEventsByHashBytes(req.params.hashBytes, Number(req.params.page), Number(req.params.limit));
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
})

router.get("/stacker-events-by-stacker/:address", async (req, res, next) => {
  try {
    const response = await findPoolStackerEventsByStacker(req.params.address);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
})

router.get("/stacker-events-by-delegator/:address", async (req, res, next) => {
  try {
    const response = await findPoolStackerEventsByDelegator(req.params.address);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
})

router.get("/pool-stacker-events/:stacker", async (req, res, next) => {
  try {
    const response = await findPoolStackerEventsByStacker(req.params.stacker);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
});

router.get("/pool-stacker-events/:stacker/:event", async (req, res, next) => {
  try {
    const response = await findPoolStackerEventsByStackerAndEvent(req.params.stacker, req.params.event);
    return res.send(response);
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
});

router.get("/sync/stacker-events", async (req, res, next) => {
  try {
    readPoolStackerEvents();
    return res.send('syncing data');
  } catch (error) {
    console.log('Error in routes: ', error)
    next('An error occurred fetching sbtc data.')
  }
});

export { router as poxRoutes }


