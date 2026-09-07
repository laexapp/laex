import test from 'node:test';
import assert from 'node:assert/strict';
import { initialDemo, simulateSwap, DEMO_FEE } from '../modules/laex-wallet/demo-model.ts';

test('swap changes both balances exactly, charges gas once and records linked movements',()=>{
 const before=initialDemo();const after=simulateSwap(before,'60');
 assert.deepEqual(after.balances,{USDT:1190000000,BNB:18000000-DEMO_FEE});
 assert.equal(after.movements.length,4);assert.equal(after.nextId,5);
 assert.equal(after.movements[0].counterparty,after.movements[1].counterparty);
 assert.equal(after.movements[0].fee+after.movements[1].fee,DEMO_FEE);
 assert.equal(new Set(after.movements.map(m=>m.id)).size,4);
 assert.deepEqual(before,initialDemo());
});
test('swap rejects overspending, missing gas and amounts below output precision',()=>{
 assert.throws(()=>simulateSwap(initialDemo(),'1251'));
 assert.throws(()=>simulateSwap({...initialDemo(),balances:{USDT:1000000,BNB:0}},'1'));
 for(const value of ['0','-1','1e2','0.000001','0.0000001'])assert.throws(()=>simulateSwap(initialDemo(),value));
 assert.equal(simulateSwap(initialDemo(),'0.000006').movements[0].units,1);
});
