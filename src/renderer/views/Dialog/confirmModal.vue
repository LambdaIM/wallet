<template>
    <Modal v-model="confirmModal" :styles="{top: '200px'}">

        <div class="modal-header" slot="header">
          <Form  @keydown.native.enter.prevent ="confirm" >
          <div v-if="txtype=='send'">
              <h2>{{$t('home.Modal1.Transfer')}}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key ">{{$t('home.Modal1.From')}}:</Col>
                    <Col span="20" class-name="value address">{{address}}</Col>
                </Row>
                <Row  class-name="item">
                    <Col span="4" class-name="key">{{$t('home.Modal1.To')}}:</Col>
                    <Col span="20" class-name="value address Highlight">{{transactiondata.toAddress}}</Col>
                </Row>
                <Row class-name="item" v-if="transactiondata.amounts">
                    <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                    <Col span="20" class-name="value Highlight">{{transactiondata.amounts[0].amount|BlanceValue}} {{denomShow}}</Col>
                </Row>
          </div>
          <div v-if="txtype=='withdrawal'">
            <h2>{{$t('Dialog.withdrawalModal.title')}}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key ">{{$t('txPopup.Operator')}}:</Col>
                    <Col span="20" class-name="value address">{{address}}</Col>
                </Row>
                <Row class-name="item" v-if="transactiondata.amount">
                    <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                    <Col span="20" class-name="value">{{transactiondata.amount|BlanceValue }} {{denomShort(transactiondata.denom)}}</Col>
                </Row>
          </div>
          <div v-if="txtype=='minerwithdrawal'">
            <h2>{{$t('somemodel.Extractstorageandmininrewards')}}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key ">{{$t('txPopup.Operator')}}:</Col>
                    <Col span="20" class-name="value address">{{address}}</Col>
                </Row>
                <Row class-name="item" >
                    <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                    <Col span="20" class-name="value">{{MinerDistributionReward }} LAMB</Col>
                </Row>
          </div>
          <div v-if="txtype=='withdrawalDistribution'">
                <h2>{{$t('home.Withdrawprofit')}}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key ">{{$t('txPopup.Operator')}}:</Col>
                    <Col span="20" class-name="value address">{{address}}</Col>
                </Row>
                <Row class-name="item" >
                    <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                    <Col span="20" class-name="value">{{DistributionReward }} LAMB</Col>
                </Row>
          </div>
          <div v-if="txtype=='transferDelegation'">
              <h2 v-if="transactiondata.type=='MsgDelegate'">{{$t('Dialog.stakingModel.title1')}}</h2>
              <h2 v-if="transactiondata.type=='MsgUndelegate'">{{$t('Dialog.stakingModel.title2')}}</h2>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
                <Col span="20" class-name="value">{{address}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('txPopup.Validator')}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.validatorAddress}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.amount|BlanceValue}} TBB</Col>
              </Row>

          </div>
          <div v-if="txtype=='redelegate'">
             <h2>{{$t('Dialog.redelegateModel.redelegate')}}</h2>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
                <Col span="20" class-name="value address">{{address}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('Dialog.redelegateModel.turnout')}}:</Col>
                <Col span="20" class-name="value address">{{transactiondata.validatorSourceAddress}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('Dialog.redelegateModel.turnin')}}:</Col>
                <Col span="20" class-name="value address">{{transactiondata.validatorDestinationAddress}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.amount|BlanceValue}} TBB</Col>
              </Row>

          </div>
          <div v-if="txtype=='AssetPledge'">
            <h2>{{$t('Dialog.com.AssetConversion')}}</h2>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
                <Col span="20" class-name="value address">{{address}}</Col>
              </Row>
                <Row v-if="transactiondata.type=='MsgAssetPledge'" class-name="item">
                  <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                  <Col span="20" class-name="value">{{transactiondata.amounts.amount|BlanceValue}} LAMB {{$t('Dialog.com.to')}}  {{transactiondata.asset.amount|BlanceValue}} TBB</Col>
                </Row>
                <Row v-else class-name="item">
                  <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                  <Col span="20" class-name="value"> {{transactiondata.asset.amount|BlanceValue}} TBB  {{$t('Dialog.com.to')}} {{transactiondata.amounts.amount|BlanceValue}} LAMB</Col>
                </Row>

          </div>

          <div v-if="txtype=='deposit'">
            <h2>{{$t('proposalsPage.Deposit')}}</h2>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
                <Col span="20" class-name="value address">{{address}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t("head.proposals")}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.proposalId}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.amounts[0].amount|BlanceValue}} {{denomShort(transactiondata.amounts[0].denom)}}</Col>
              </Row>

          </div>
          <div v-if="txtype=='vote'">
            <h2>{{$t('proposalsPage.Vote')}}</h2>
            <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
                <Col span="20" class-name="value address">{{address}}</Col>
            </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t("head.proposals")}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.proposalId}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t("proposalsPage.Vote")}}:</Col>
                <Col span="20" class-name="value">{{$t(`proposalsPage.${transactiondata.option}`)}} </Col>
              </Row>

          </div>
          <div v-if="txtype=='CreateBuyOrder'">
            <h2>{{$t('Dialog.AutoBuy.Buyspace')}}</h2>
            <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
                <Col span="20" class-name="value address">{{address}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('Dialog.AutoBuy.Marketname')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.marketName}}</Col>
            </Row>
            <Row class-name="item" v-if="transactiondata.sellOrderId&&transactiondata.sellOrderId!='[do-not-input-value]'">
              <Col span="4" class-name="key">{{$t('Dialog.selectBuy.OrderID')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.sellOrderId}}</Col>
            </Row>
            <Row class-name="item">
            <Col span="4" class-name="key">{{$t('Dialog.AutoBuy.space')}}:</Col>
            <Col span="20" class-name="value">{{transactiondata.size}} GB</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('Dialog.AutoBuy.duration')}}:</Col>
            <Col span="20" class-name="value">{{transactiondata.duration|formatMonth}} {{$t('Dialog.AutoBuy.month')}}</Col>
          </Row>


          </div>
          <div v-if="txtype=='CreateSellOrder'">
            <h2>{{$t('Dialog.sellorder.Sellingspace')}}</h2>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>

        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.sellorder.Sellingspace')}}:</Col>
          <Col span="20" class-name="value">{{transactiondata.sellSize}} GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.sellorder.unitprice1')}}:</Col>
          <Col span="20" class-name="value">{{transactiondata.price|BlanceValue}} {{$t('Dialog.sellorder.unitprice2')}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.sellorder.Odds')}}:</Col>
          <Col span="20" class-name="value">{{parseFloat(transactiondata.rate).toFixed(2)}} {{$t('Dialog.sellorder.times')}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="5" class-name="key"> {{$t('Dialog.sellorder.Minimumspace')}}:</Col>
          <Col span="19" class-name="value">{{transactiondata.minBuySize}}GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="5" class-name="key"> {{$t('Dialog.sellorder.Minimumtime')}}:</Col>
          <Col span="19" class-name="value">{{transactiondata.minBuyDuration|formatMonth}} {{$t('Dialog.sellorder.month')}} </Col>
        </Row>
        <Row class-name="item">
          <Col span="5" class-name="key"> {{$t('Dialog.sellorder.Maximumtime')}}:</Col>
          <Col span="19" class-name="value">{{transactiondata.maxBuyDuration|formatMonth}} {{$t('Dialog.sellorder.month')}} </Col>
        </Row>


          </div>
          <div v-if="txtype=='CreateMiner'">
            <h2>{{$t('sellpageinfo.Initializeminer')}}</h2>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('somemodel.Miningsubaccount')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.miningAddress}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">DhtId:</Col>
              <Col span="20" class-name="value">{{transactiondata.dhtId}}</Col>
            </Row>

          </div>

          <div v-if="txtype=='OrderRenewal'">
            <h2>{{$t('renewal.Orderrenewal')}}</h2>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('renewal.Duration')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.duration|formatMonth}}{{$t('Dialog.sellorder.month')}} </Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('renewal.orderid')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.orderId}}</Col>
            </Row>

          </div>

          <div v-if="txtype=='MsgMinerWithDrawCount'">
            <h2>{{$t('orderrevenue.WithdraworderCommission')}}   </h2>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('orderrevenue.Pagenumber')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.page}} </Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('orderrevenue.Number')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.limit}}</Col>
            </Row>

          </div>

          <div v-if="txtype=='marketTransferDelegateMarket'">
            <h2>{{$t('txPopup.Marketpledge')}} </h2>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('home.Modal1.From')}}:</Col>
              <Col span="16" class-name="value">{{address}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('txPopup.Marketname')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.marketName}} </Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('txPopup.amount')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.amount|Lambformat}}</Col>
            </Row>

          </div>
          <div v-if="txtype=='marketTransferWithDrawMarket'">
            <h2> {{$t('txPopup.Withdrawalmarketpledgeincome')}}   </h2>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="16" class-name="value">{{address}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('txPopup.Marketname')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.marketName}} </Col>
            </Row>


          </div>

          <div v-if="txtype=='CancelSellOrder'">
            <h2> {{$t('sellpageinfo.Cancelsalesorder')}}  </h2>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('syncorderpage.orderID')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.orderId}}</Col>
            </Row>
          </div>

          <div v-if="txtype=='CreateAsset'">
            <h2> {{$t('CreateassetsPop.Createassets')}}  </h2>

            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.AssetName')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.asset_denom|assertdenomformat}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.Assetfullname')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.name}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.Initialcirculation')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.asset_amount|BlanceValue}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.Issuingtype')}}:</Col>
              <Col span="16" class-name="value">{{getTypeName(transactiondata.mint_type)}}</Col>
            </Row>
            <Row v-if="transactiondata.mint_type=='3'" class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.Totalsupply')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.total_supply|BlanceValue}}</Col>
            </Row>
            <Row v-if="transactiondata.mint_type=='3'" class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.inflation')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.inflation|BlanceValue}}</Col>
            </Row>
            <Row v-if="transactiondata.mint_type=='3'" class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.adjust_rate')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.adjust_rate}}</Col>
            </Row>
            <Row v-if="transactiondata.mint_type=='3'" class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.max_adjust_count')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.max_adjust_count}}</Col>
            </Row>
            <Row v-if="transactiondata.mint_type=='3'" class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.adjust_period')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.adjust_period}}</Col>
            </Row>
            <Row v-if="transactiondata.mint_type=='3'" class-name="item">
              <Col span="5" class-name="key">{{$t('CreateassetsPop.genesis_height')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.genesis_height}}</Col>
            </Row>

          </div>

          <div v-if="txtype=='CreateDigitalAssetMarket'">
            <h2> {{$t('AuthorizedmarketPop.Createanauthorizedmarket')}}  </h2>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('AuthorizedmarketPop.Marketname')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.marketName}}</Col>
            </Row>

            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('AuthorizedmarketPop.AssetName')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.AssetName|assertdenomformat}}</Col>
            </Row>

            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('AuthorizedmarketPop.Exchangeratio')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.Ratio}}</Col>
            </Row>

          </div>

          <div v-if="txtype=='DigitalAssetPledge'">
            <h2> {{$t('AuthorizeMarketpledge.pledge')}} </h2>

            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('AuthorizeMarketpledge.AssetName')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.AssetName|assertdenomformat}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('AuthorizeMarketpledge.space')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.Size}}GB</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('Dialog.sellorder.unitprice1')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.Price|BlanceValue}}{{transactiondata.AssetName|assertdenomformat}}/GB/month</Col>
            </Row>

          </div>


          <div v-if="txtype=='DigitalAssetRefund'">
            <h2> {{$t('Redemptionpledge.redemption')}} </h2>

            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('Redemptionpledge.AssetName')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.AssetName|assertdenomformat}}</Col>
            </Row>


          </div>


          <div v-if="txtype=='DismissDigitalAssetMarket'">
            <h2> {{$t('Dissolvethemarket.Dissolutionmarket')}} </h2>

            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('Dissolvethemarket.AssetName')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.AssetName|assertdenomformat}}</Col>
            </Row>


          </div>



          <div v-if="txtype=='AuthorizeMiningPubKey'">
            <h2> {{$t('Authorizedminingpop.Authorization-MinerMining')}} </h2>
            <Row class-name="item">
              <Col span="3" class-name="key">{{$t('Authorizedminingpop.AssetName')}}:</Col>
              <Col span="21">

              {{transactiondata.AssetName|assertdenomformat}}

              </Col>
            </Row>
            <Row class-name="item">
              <Col span="3" class-name="key">{{$t('Authorizedminingpop.Authorizedpublickey')}}:</Col>
              <Col span="21">
              <Input readonly :rows="4" type="textarea" v-model="transactiondata.PubKey.value"    />

              </Col>
            </Row>


          </div>
          <div v-if="txtype=='assertDeactivateMiner'">
            <h2> {{$t('DeactivateMinerpop.Deactivate')}} </h2>
            <Row class-name="item">
              <Col span="3" class-name="key">{{$t('Authorizedminingpop.AssetName')}}:</Col>
              <Col span="21">

              {{transactiondata.AssetName|assertdenomformat}}

              </Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('DeactivateMinerpop.address')}}:</Col>
              <Col span="20">
              <Input readonly   v-model="transactiondata.Miner"    />

              </Col>
            </Row>
          </div>

          <div v-if="txtype=='assertActivateMiner'">
            <h2> {{$t('ActivateMinerpop.Activate')}} </h2>
            <Row class-name="item">
              <Col span="3" class-name="key">{{$t('Authorizedminingpop.AssetName')}}:</Col>
              <Col span="21">

              {{transactiondata.AssetName|assertdenomformat}}

              </Col>
            </Row>

          </div>
          <!-- CreateAsset -->
          <div v-if="txtype=='assertDamCreateBuyOrder'">
            <h2> {{$t('Purchasespace.Purchaseauthorizedspace')}}   </h2>
            <Row class-name="item">
              <Col span="3" class-name="key">{{$t('Authorizedminingpop.AssetName')}}:</Col>
              <Col span="21">

              {{transactiondata.Asset|assertdenomformat}}

              </Col>
            </Row>
            <Row class-name="item">
              <Col span="3" class-name="key">{{$t('Purchasespace.Mineroperationaddress')}}:</Col>
              <Col span="21">

              {{transactiondata.minerAddress}}

              </Col>
            </Row>
            <Row class-name="item">
              <Col span="3" class-name="key">{{$t('Purchasespace.Size')}}:</Col>
              <Col span="21">

              {{transactiondata.Size}}GB

              </Col>
            </Row>
            <Row class-name="item">
              <Col span="3" class-name="key">{{$t('Purchasespace.Size')}}:</Col>
              <Col span="21">

              {{transactiondata.Duration|formatMonth}}{{$t('Dialog.selectBuy.month')}}


              </Col>
            </Row>

          </div>

          <div v-if="txtype=='DamOrderRenewal'">
            <h2>{{$t('Orderrenewal.title')}}</h2>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('renewal.Duration')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.duration|formatMonth}}{{$t('Dialog.sellorder.month')}} </Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('renewal.orderid')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.orderID}}</Col>
            </Row>

          </div>

          <div v-if="txtype=='assertDamMinerWithDrawCount'">
            <h2>{{$t('Assetincomepop.title')}}</h2>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('Authorizedminingpop.AssetName')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.asset|assertdenomformat}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('orderrevenue.Pagenumber')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.page}} </Col>
            </Row>
            <Row class-name="item">
              <Col span="5" class-name="key">{{$t('orderrevenue.Number')}}:</Col>
              <Col span="16" class-name="value">{{transactiondata.limit}}</Col>
            </Row>

          </div>

          <div v-if="txtype=='loan_Supply'">
            <h2>{{$t('poolmarkettx.loan_Supply_title')}}</h2>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>

            <Row class-name="item">
              <Col span="6" class-name="key">{{$t('poolmarkettx.Marketname')}}:</Col>
              <Col span="18" class-name="value">{{transactiondata.name}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('poolmarkettx.Amount')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.token|BlanceValue}} LAMB </Col>
            </Row>


          </div>
          <div v-if="txtype=='loan_SupplierAbort'">
            <h2>{{$t('poolmarkettx.loan_Withdrawal_title')}} </h2>

            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>

            <Row class-name="item">
              <Col span="6" class-name="key">{{$t('poolmarkettx.Marketname')}}:</Col>
              <Col span="18" class-name="value">{{transactiondata.marketName}}</Col>
            </Row>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('poolmarkettx.Amount')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.token|BlanceValue}} LAMB </Col>
            </Row>


          </div>
          <div v-if="txtype=='loan_SupplierWithdraw'">
            <h2>{{$t('poolmarkettx.loan_Withdrawalincome_title')}} </h2>

            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>

            <Row class-name="item">
              <Col span="6" class-name="key">{{$t('poolmarkettx.Marketname')}}:</Col>
              <Col span="18" class-name="value">{{transactiondata.marketName}}</Col>
            </Row>


          </div>

          <div v-if="txtype=='loan_LoaneeWithDraw'">
            <h2>{{$t('poolmarkettx.loan_powerincome_title')}} </h2>

            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>

            <Row class-name="item">
              <Col span="6" class-name="key">{{$t('poolmarkettx.Marketname')}}:</Col>
              <Col span="18" class-name="value">{{transactiondata.marketName}}</Col>
            </Row>


          </div>
          <div v-if="txtype=='loan_LoanOrderRenewal'">
            <h2>{{$t('poolmarkettx.Orderrenewal')}} </h2>
            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('txPopup.Operator')}}:</Col>
              <Col span="20" class-name="value">{{address}}</Col>
            </Row>

            <Row class-name="item">
              <Col span="4" class-name="key">{{$t('poolmarkettx.OrderID')}}:</Col>
              <Col span="20" class-name="value">{{transactiondata.orderID}}</Col>
            </Row>


          </div>



          <Row class-name="item">
            <Input @on-change="gaseFeechange" ref="gasinput_"  v-model="gaseFee" >
              <span slot="prepend">{{$t('Dialog.com.gasfee')}}</span>
              <span slot="append">LAMB</span>
          </Input>
          <div class="tiptxt">{{$t('Dialog.com.gastip')}}</div>

          </Row>
          <Row v-if="transactiondata.memo!=''&&transactiondata.memo!=undefined "  class-name="item">
            <Input  v-model="transactiondata.memo" readonly type="textarea" :rows="4"  />
          </Row>
          </Form>

        </div>
        <div slot="footer">
          <Button type="primary" @click="confirm">{{$t('home.Modal1.Confirm')}}</Button>
        </div>

      </Modal>
</template>
<script>
import Gasinput from './Gas.vue';
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  components: {
    Gasinput
  },
  data() {
    return {
      confirmModal: false,
      editmemo: false,
      transactiondata: {},
      txtype: '',
      gaseFee: ''
    };
  },
  mounted() {

  },
  methods: {
    open(txtype, transactiondata) {
      console.log('打开对话框');
      this.$data.txtype = txtype;
      this.$data.transactiondata = transactiondata;
      eventhub.$emit('GetGase', transactiondata);
      this.getgase();

      this.confirmModal = true;
      var _this = this;
      setTimeout(() => {
        _this.$refs.gasinput_.focus();
      });
    },
    confirm() {
      if (this.gaseFeechange() == false) {
        return;
      }
      var comparedNum = this.bigNum(this.toBigNumStr(this.$data.gaseFee)).comparedTo(this.$store.getters.balanceLamb);
      if (comparedNum == 1 || comparedNum == null) {
        this.$Notice.warning({
          title: 'error',
          desc: this.$t('Dialog.com.Lesscommission')
        });
        return;
      }
      this.confirmModal = false;
      console.log(this.$data.transactiondata);

      eventhub.$emit('TxConfirm', this.$data.transactiondata, this.toBigNumStr(this.$data.gaseFee));
    },
    async getgase() {
      try {
        let res = await ipc.callMain('Simulate', { transactiondata: this.$data.transactiondata });
        if (res.state) {
          this.$data.gaseFee = res.data;
          // eventhub.$emit('gaseValue', res.data);
        }
      } catch (ex) {
        this.$Notice.warning({
          title: 'error',
          desc: ex.errormsg
        });
        console.log(ex);
      }
    },
    denomShort: function(denom) {
      return denom.substr(1).toUpperCase();
    },
    gaseFeechange: function() {
      var value = parseFloat(this.$data.gaseFee);
      if (isNaN(value)) {
        return false;
      }
      if (value < 0) {
        return false;
      }

      if (value > 50 && this.txtype != 'MsgMinerWithDrawCount') {
        this.$data.gaseFee = 0.001;
        this.$Notice.warning({
          title: 'error',
          desc: this.$t('Dialog.com.muchcommission')
        });
        return false;
      }
    },
    getTypeName(types) {
      if (types == '1') {
        return this.$t('CreateassetsPop.Non-issueable');
      } else if (types == '2') {
        return this.$t('CreateassetsPop.One-timeissuance');
      } else if (types == '3') {
        return this.$t('CreateassetsPop.Additionalmining');
      }
    }
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    denomShow: function() {
      return this.transactiondata.amounts[0].denom.substr(1).toUpperCase();
    },
    MinerDistributionReward() {
      return this.bigNumType(this.$store.getters.getMinerReward);
    },
    DistributionReward() {
      // 节点收益
      return this.bigNumType(this.$store.getters.getDistribution);
    }
  }

};
</script>
<style lang="less" scoped>
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }
}

.address{
  font-family: Consolas,Monaco,monospace;
}

.tiptxt{
  color: red;
  padding-top: 20px;
  line-height: 20px;
}
.Highlight{
  color: #19be6b;
}
</style>
