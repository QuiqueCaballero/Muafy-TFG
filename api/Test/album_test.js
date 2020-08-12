var assert    = require("chai").assert;
var album = require("../controladores/album");


describe("Test 1", function(){

	it("test 1", async() => {
		res = {status: '', message: {}};
		const response = album.getAlbum({params: {id: '1'}}, res);//{id: '5d076f08cb574b3be4d16f6a'}}, res);
		response.should.be.a('promise');

		await response;
		res.status.should.be.calledWith('404');
		done();
		//expected = {message: 'El album no existe'};
		//assert.equal(response, expected);
	});
});