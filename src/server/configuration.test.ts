import Configuration from "./configuration";


describe('Configuration file tests', () => {
    const emptyEnv = process.env;
    const blaiseApiUrl = "http://localhost:80";
    const buildFolder = "../build";
    const port = 5000;

    beforeEach(() => {
        jest.resetModules() // Most important - it clears the cache
        process.env['BLAISE_API_URL'] = blaiseApiUrl
        process.env['PORT'] = port.toString()
      });

    afterEach(() => {
        process.env = {...emptyEnv};
    })

    // ensure other test files are not pullted with environment variable setup  
    afterAll(() => {
        process.env = {...emptyEnv};
    })

    it("should populate the properties with values from environement variables when they exist in the environment variables", () => {         
        // act
        const sut = new Configuration();

        // assert
        expect(sut.BlaiseApiUrl).toEqual(blaiseApiUrl);
        expect(sut.BuildFolder).toEqual(buildFolder);
        expect(sut.Port).toEqual(port);
    });

    it("should throw an error if the BLAISE_API_URL does not exist in the environment variables", () => { 
        // arrange
        process.env['BLAISE_API_URL'] = undefined;
        const configuration = () => {new Configuration();}
        
        // act && assert
        expect(configuration).toThrowError(ReferenceError)
        expect(configuration).toThrowError('BLAISE_API_URL not found in environment variables')
    });   

    it.each(['', ' ', '  '])("should throw an error if the BLAISE_API_URL is empty", (value) => { 
        // arrange
        process.env['BLAISE_API_URL'] = value;
        
        // act && assert
        expect(() => {new Configuration();}).toThrowError('BLAISE_API_URL is an empty string')
    });  

    it("should throw an error if the PORT does not exist in the environment variables", () => { 
        // arrange
        process.env['PORT'] = undefined;
        const configuration = () => {new Configuration();}

        // act && assert
        expect(configuration).toThrowError(ReferenceError)
        expect(configuration).toThrowError('PORT not found in environment variables')
    });
    
    it.each(['', 'NotNumber', 'eight'])("should throw an error if the PORT not number", (value) => { 
        // arrange
        process.env['PORT'] = value;
        const configuration = () => {new Configuration();}
        
        // act && assert
        expect(configuration).toThrowError(TypeError)
        expect(configuration).toThrowError('PORT is not a valid number')
    });
});