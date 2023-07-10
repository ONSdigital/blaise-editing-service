import Configuration from "./configuration";


describe('Configuration file tests', () => {
    const emptyEnv = process.env;

    beforeEach(() => {
        jest.resetModules() // Most important - it clears the cache
        process.env = {...emptyEnv};
      });

    // ensure other test files are not pullted with environment variable setup
    afterAll(() => {
        process.env = {...emptyEnv};
    })
      
    it("should populate the properties with values from environement variables when they exist in the environment variables", () => { 
        // arrange
        const blaiseApiUrl = "http://localhost:80";
        process.env['BLAISE_API_URL'] = blaiseApiUrl

        // act
        const sut = new Configuration();

        // assert
        expect(sut.BlaiseApiUrl).toEqual(blaiseApiUrl)
    });

    it("should throw an error if the BLAISE_API_URL does not exist in the environment variables", () => { 
        // act && assert

        expect(() => {new Configuration();}).toThrowError('BLAISE_API_URL not found in environment variables')
    });   

    it.each(['', ' ', '  '])("should throw an error if the BLAISE_API_URL is empty", (value) => { 
        // arrange
        process.env['BLAISE_API_URL'] = value;
        
        // act && assert
        expect(() => {new Configuration();}).toThrowError('BLAISE_API_URL is an empty string')
    });  
});