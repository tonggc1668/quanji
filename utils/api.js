// var baseUrl = "https://quanji.magicalcoder.com/"
var baseUrl = "http://www.quanji88.com.cn/"
//  var baseUrl = "http://test.quanji88.com.cn/"


const api = {
  sessionId: "null",
  //0表示正常逻辑 1表示分享进入 
  comeType: 0,
  //分享shopID
  shareShopID: -1,
  //用户登录types
  loginType: baseUrl + "web/user_web/login",
  //用户信息
  wx_info: baseUrl + "user/user_web/wx_info",
  //用户登录
  accredit: baseUrl + "web/user_web/accredit",
  //精彩拼团
  wonderful_group: baseUrl + "web/goods_spu/wonderful_group",
  //实时榜单
  best_list: baseUrl + "web/goods_spu/best_list",
  //商品详情
  coupon_detail: baseUrl + "web/goods_spu/coupon_detail",
  //店铺精选
  shop_selection: baseUrl + "web/goods_spu/shop_selection",
  //拼团商品详情                                                                       
  group_detail: baseUrl + "web/goods_spu/group_detail",
  //热卖商品列表
  best_sellers: baseUrl + "web/goods_spu/best_sellers",
  //猜你喜欢
  you_like: baseUrl + "web/goods_spu/you_like",
  //猜你喜欢其他
  you_like_other: baseUrl + "web/goods_spu/you_like_other",
  //其他类目列表
  category_list: baseUrl + "web/goods_spu/category_list",
  //我的收益
  per_income_homepage: baseUrl + "user/orders/per_income_homepage",
  //我的订单
  order_list: baseUrl + "user/orders/list",
  //拼团信息
  getlist_bygoodsid: baseUrl + "web/group_found/getlist_bygoodsid",
  //收益列表
  per_income_log: baseUrl + "user/orders/per_income_log",
  //优惠券列表
  coupon_list: baseUrl + "user/user_coupon/list",
  //生成小程序码
  qrcodeCreate: baseUrl + "web/goods_spu/QRCode",
  //商品规格
  spec_list: baseUrl + "web/goods_spec/spec_list",
  //我的收藏
  my_collection: baseUrl + "user/goods_spu/collection_list",
  //提现记录
  draw_crash: baseUrl + "user/user_web/detail",
  //下单接口
  create_orders: baseUrl + "user/orders/create_orders",
  //获取店铺装修信息
  web_shop_details: baseUrl + "web/shop_decoration/item",
  //获取店铺装修信息
  user_shop_details: baseUrl + "user/shop_decoration/item",
  //订单详情
  order_detail: baseUrl + "user/orders/detail",
  //我的收藏列表删除
  cancel_collection: baseUrl + "user/favorites/save",
  //商品详情页下单判断库存
  prompt_stock: baseUrl + "web/goods_sku_spec_attr/attr_sku",
  //商品详情页收藏
  add_collection: baseUrl + "user/favorites/save",
  //用户领取优惠卷或者分享，保存优惠券接口
  saveOrGetCoupon: baseUrl + "user/user_coupon/save",
  //生成订单
  create_order: baseUrl + "user/orders/create_orders",
  //获取验证码
  get_code: baseUrl + "web/sms/code",
  //申请成为店主详情
  send_detail: baseUrl + "user/seller_apply/save",
  //申请店主支付
  seller_apply_pay: baseUrl + "user/seller_apply/winXinSubscribePay",
  //修改店铺名称
  changeShopName: baseUrl + "user/shop_decoration/save",
  //提现记录
  drawCrash: baseUrl + "user/shop_profit/save",
  //首页轮播图
  swiper_img: baseUrl + "/web/special_pic/list",
  //订单支付
  order_pay: baseUrl + "/user/orders/wx/payments",
  //轮播跳转专场
  swiper_to_spec: baseUrl + "web/goods_spu/special_list",
  //轮播跳转单品
  swiper_to_single: baseUrl + "web/goods_spu/special_list",
  //实名认证
  real_name: baseUrl + "user/identity_certification/save",
  //拼团拿到商品数量
  get_group_num: baseUrl + "user/group_found_users/get_num",
  //上传图片
  uploadShopLogo: baseUrl + "user/shop_decoration/upload_shop_logo",
  //专场
  special_module: baseUrl + "/web/special_pic/list",
  //专场2
  special_module_two: baseUrl +"/web/special_pic/list2",
  //收货确定
  confirm: baseUrl + "/user/orders/logistics/confirm",
  //订单个数
  mineOrderNum: baseUrl + "/user/orders/quantity/statistics",
  //物流信息
  transInfo: baseUrl + "/user/orders_logistics_info/detail",
  //累计收益
  totalEarnings: baseUrl + "/user/orders/income/info/diagram",
  //礼物领取
  giftReceive: baseUrl + "user/orders_gift_invitee/gift/receive",
  //礼物接收
  giftAccept: baseUrl + "user/orders_gift_invitee/gift/accept",
  //礼物详情
  giftInfo: baseUrl + "user/orders_advance/info",
  //赠送礼物
  sendGift: baseUrl + "web/orders_advance/gift/send",
  //礼物信息
  giftInfoWithinLogin: baseUrl + "web/orders_advance/summary",
  //礼物订单列表
  gift_list:baseUrl+"user/orders_advance/list",
  //转增他人
  get_gift_num:baseUrl+"user/orders_gift_invitee/gift/giventoother",
  //获取导航栏类目
  get_index_category: baseUrl +"web/goods_category/navigationBar",
  //礼物取消订单
  cancel_gift_order: baseUrl + "user/orders/cancel",
  //游戏跳转平台更换shopId接口
  get_new_store: baseUrl +"web/shop_decoration/advertisement/shop",
  //（“领”）抽礼物
  orders_gift_participants: baseUrl +"user/orders_gift_participants/get",
  //更新用户信息(重新授权获取用户信息)
  update_user_info: baseUrl +"user/user_web/update_user_info",
  //查看礼物详情抽奖情况
  participant_list: baseUrl +"/user/orders_gift_participants/participant_list"
  
}

module.exports = api;