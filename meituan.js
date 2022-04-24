const to_mall_cart = () => {
	shopping_cart_btn=id('img_shopping_cart').findOne()
		
	if(shopping_cart_btn){
		shopping_cart_btn.parent().click() //btn上一级控件可点击
		toast('已进入购物车')
	}else{
		toast('未找到购物车按钮，退出')
		exit;
	}
}

const submit_order = (count,clicks) => {
		toast('抢菜第'+count+'次尝试')
		//美团买菜 结算按钮无id
        while(true){
            if(textStartsWith('结算').exists()){
                submit_btn=textStartsWith('结算').findOne()
                if(!submit_btn){
                    toast('未找到结算按钮，退出')
                    exit;
                }
                if(clicks>1){
                    sleep(550)
                }
                clicks=clicks+1
                submit_btn.parent().click()
                break
            }else{
                break
            }
            
        }
        while(true){
            if(textStartsWith('我知道了').exists()){
                textStartsWith('我知道了').findOne().parent().click()
                break;
            }else if(textStartsWith('返回购物车').exists()){
				textStartsWith('返回购物车').findOne().parent().click()
                break;
			}else if(textStartsWith('放弃机会').exists()){
                textStartsWith('放弃机会').findOne().parent().click()
                break;
            }if(textStartsWith('极速支付').exists()){
				textStartsWith('极速支付').findOne().parent().click()
			}if(textStartsWith('立即支付').exists()){
				textStartsWith('立即支付').findOne().parent().click()
			}else{
                break
            }
        }
		sleep(100)
		count=count+1;
		if(count>18000){
			toast('抢菜失败')
			exit;
		}
		submit_order(count,clicks)
}

const start = () => {
    toast("okokokokokokokokokokokok")
    kill_app('美团买菜')
    
	const appName = "美团买菜";
	launchApp(appName);
	sleep(600);  
	auto.waitFor()
	//跳过开屏广告
	btn_skip=id('btn_skip').findOne()
	if(btn_skip){
		btn_skip.click()
		toast('已跳过开屏广告')
	}
	sleep(600);  
	//跳过后加载首页会有一段时间再加载出购物车

	
	to_mall_cart()
	sleep(2000) //等待购物车加载完成
	submit_order(0,0)
		


}

function kill_app(packageName) {
    var name = getPackageName(packageName);
    if (!name) {
        if (getAppName(packageName)) {
            name = packageName;
        } else {
            return false;
        }
    }
    app.openAppSetting(name);
    text(app.getAppName(name)).waitFor();
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
    if (is_sure.enabled()) {
        textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
        buttons=textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*|确定|是)/).find()
        if(buttons.length>0){
            buttons[buttons.length-1].click()
        }
        
        log(app.getAppName(name) + "应用已被关闭");
        sleep(1000);
        back();
    } else {
        log(app.getAppName(name) + "应用不能被正常关闭或不在后台运行");
        back();
    }
}
start()
