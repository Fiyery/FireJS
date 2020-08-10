function change_page(page) {
	console.log(page)
}

fire.ready(function(){

	fire.get("#load_page").on("click", () => {
		fire.get("fpage").data("disabled", false);
		fire.component.run();
	});







	// console.log(fire.get(".page_begin").prop("children")[0]);

	



    // fire.get("button").on("mouseover click", (e) => {
    //     console.log(e.type);
    // });

    // fire.get("button").on("click", (e) => {
    //     console.log(e.type + "2");
    // });

    // // console.log(fire.get("button").eq(0).events());

    // // console.log(fire.get("button").node());
    // // console.log(fire.get("button").clone(true).node());
    // // console.log(fire.get("button").clone(true));



    // fire.get("body").append(fire.get("button"));
	
	// let obj = {
	// 	key: "EI"
	// };
	// obj.data = "";

	// fire.watch(obj, (v, p) => {
	// 	console.log("Changed " + p + " : " +v+ " => " + obj.data);
    // });

    // console.log("Return type => ", fire.ready());

    // alert("ok");

    // document.addEventListener("DOMContentLoaded", () => {
    //     console.log("Vanilla JS loaded");
    // });

    // fire.ready(() => {
    //     console.log("Event loaded 1");
    // });

    // fire.ready().then(() => {
    //     console.log("Event loaded 2");
    // });

    // console.log(fire.ready().get("button"));

    // console.log(fire.get("#call").css("display", "none"));
    // let option = fire.create("option").text("1");
    // fire.get(".select").append(option);

	// fire.get(".target").on("click", function(){
	// 	console.log("clicked");
	// });
	// fire.get(".target").trigger("click");

	// var count = 0;
	// var count2 = 0;
	// fire.get("#on").on("click", ()=>{
	// 	fire.get("#call").on("click",()=>{
	// 		console.log("click launch => " + ++count);
	// 	});
	// 	fire.get("#call").on("mouseover",()=>{
	// 		console.log("hover launch => " + ++count2);
	// 	});
	// });

	// fire.get("#off").on("click", ()=>{
	// 	fire.get("#call").off("click");
	// });





	// fire.get("button").on("click", () => {
	// 	let e = fire.get(".object").clone().removeClass(".object");
	// 	e.find("ul").empty();
	// 	fire.get("#bloc").prepend(e);
	// });

	// console.log(fire.get("input:nth-child(1)").eq(0).prop("value"));



	// console.log(fire.get("input"));
	// console.log(fire.get("input").eq(-1));
	// console.log(fire.get("input").last());
	// console.log(fire.get("input").first());

	// console.log(Fire.get("input[type='radio']"));
	// console.log(Fire.get("input[type='radio']").val());
	// console.log(Fire.get("input[type='radio']").val("2"));
	// console.log(Fire.get("input[type='radio']:checked").val());

	// fire.get('body > div.test').hide();

	// fire.get('button').on('click', function(){
	// 	console.log(this);
	// 	fire.get('.hover div').toggle();
	// });

	// fire.get('textarea, select').on('keypress', function(event){
	// 	console.log(event);
	// });

	// console.log('test 1 => 3', fire.get('option'));
	// console.log('test 1 => 1', fire.get('select option:nth-child(3)'));
	// console.log('test 1 => 1', fire.get('option:nth-child(1)'));
	// console.log('test 1 => 1', fire.get('option:nth-child(2)'))
	// console.log('test 1 => 3', fire.get('option'));

	// console.log('data', fire.datalist);

	// console.log(fire.get('select').find('*[selected="selected"]'));

	// fire.get('button').css({
	// 	'background-color' : 'blue',
	// 	'border' : '3px solid green'
	// });

	// fire.get('button').width(800);
	// fire.get('button')[0].width(700);
	// fire.get('button').height(100);
	// console.log(fire.get('button').width());

	// let el = Fire.get('button').on('click', function(){
	// 	alert('click');	
	// });

	// console.log(Fire.get('button.tpt'));


	
});