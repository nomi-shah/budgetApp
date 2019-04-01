///BUDGET CONTROLLER
var budgetController = (function(){
    var Income = function (id , description ,  value ){
            this.id =  id;
            this.description =  description;
            this.value =  value;
    };
    var Expense = function (id , description ,  value ){
        this.id =  id;
        this.description =  description;
        this.value =  value;
};

var calculateTotal = function(type){
    var sum = 0 ;
    data.allItem[type].forEach(function(current){
            sum =  sum + current.value;
    });
    data.totals[type]= sum ;
};

var data = {
    allItem :{
        exp :[],
        inc :[]
    },
    totals :{
        exp: 0,
        inc: 0 
    },
    budget : 0,
    percentage: -1
    
};
    return  {
        addItem:function( type , des , val){
            var newItem ,ID ;
            //create new ID
            if(data.allItem[type].length>0){
                ID = data.allItem[type][data.allItem[type].length -1 ].id + 1;

            } else {
                ID =  0 ;
            }
           
            // create new item based on 'inc'  or 'exp' type 
            if(type === 'exp'){
               newItem =  new Expense(ID , des ,  val );
            }else if (type ===  'inc'){
                newItem =  new Income(ID , des ,  val );
            }

            // Push it into out data structure 
            data.allItem[type].push(newItem);
            //return   the element 
            return  newItem;
        },

        calculateBudget :  function (){
            //calculate Total  Income and expense  
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate The bidget    Income - expense 
            data.budget =  data.totals.inc - data.totals.exp;
            // calculate percentage of income 

            if (data.totals.inc > 0){
                data.percentage = Math.round(( data.totals.exp /data.totals.inc )*100);
            }
            else{

                data.percentage = -1 ;
            }

        },

        getBudget : function (){
            return {
                budget : data.budget,
                percentage : data.percentage,
                totalInc : data.totals.inc,
                totalExp: data.totals.exp
            };
        },

        testing :  function (){
            console.log(data);
        }   
    };
      
   
})();



//UI CONTROLER 
var UIController = (function(){
    // some code 
    var DOMstrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputvalue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer :'.income__list',
        expensesContainer :'.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel :'.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };
    return{ 
        getInput: function(){

            return{
                type:  document.querySelector(DOMstrings.inputType).value,
                description:  document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputvalue).value
                )};
        },
        addListItem : function(obj , type ){
            var html , newHtml ,  element;    
            //Create Html for Place holder
            if( type === 'inc'){
                element =  DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type ===  'exp'){
                element = DOMstrings.expensesContainer;
            html =  '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
            //Replace place holder with actual data 
                newHtml= html.replace('%id%' , obj.id);
                newHtml= newHtml.replace('%description%' , obj.description);
                newHtml= newHtml.replace('%value%', obj.value);
                //insert html into the dom 

                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        clearFields : function(){
            var feilds , feildarr;
            feilds =  document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputvalue);

            feildarr =  Array.prototype.slice.call(feilds);

            feildarr.forEach( function(current , index , array) {
                current.value ="";

            });
            feildarr[0].focus();
        },
        displayBudget : function (obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if(obj.percentage > 0 ){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent =  '--';
            }
        },

        getDOMstrings:function(){
            return DOMstrings;
        }
    };
})();



//GLOBLE APP COONTROLLER 

var Controller = (function(budgetCtrl ,  UICtrl){
    
    var setupEventListner =  function(){

        var DOM =  UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

            document.addEventListener('keypress',function(e) {
            if(e.keyCode === 13 || e.which === 13  ){
              ctrlAddItem();
            }
        });
    };
    
    var  updateBudget =  function(){
    // 1 . calculate the  budget
        budgetCtrl.calculateBudget();
    // 2 Return The budget 
        var budget =  budgetController.getBudget();
    // 3 Display budget on UI 
        UICtrl.displayBudget(budget);
    };

   var ctrlAddItem =  function (){
       
        // 1 . Get the feild input data 
            var input =  UICtrl.getInput();
           // console.log(input);

            if (input.description !== ""  && !isNaN(input.value) && input.value > 0 ){
            
                // 2 . Add the item to budget controller 
            var newItem = budgetController.addItem(input.type, input.description, input.value)
            // 3 . Add the item in to UI 
    
            UICtrl.addListItem(newItem, input.type);
            //clearfeilds 
            UICtrl.clearFields();
             
            // 5 . display  the budget on the UI
            updateBudget();
        }
 };
   
    return  {
        init:  function(){
                console.log('Application is started ');
                UICtrl.displayBudget({
                        budget : 0,
                        percentage : -1,
                        totalInc : 0,
                        totalExp: 0
                    
                });

                setupEventListner();
        }
    };

})(budgetController , UIController);

Controller.init();