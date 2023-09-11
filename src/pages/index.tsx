import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/';
const API_KEY = 'my_key'

export default function Home() {
    const title = 'ImgEng'
    const [ imageData, setImageData ] = useState( '' );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ prompt, setPrompt ] = useState( '' );
    const [ error, setError ] = useState<string>( '' );
    const [ format, setFormat ] = useState( 'b64_json' );
    const [ generateSize, setGenerateSize ] = useState<string>( '512' );
    const [ imageSize, setImageSize ] = useState<number>( 512 );

    const generateImage = useCallback( async () => {
        if ( !prompt ) {
            alert( 'プロンプトがありません' );
            return;
        }
        if ( isLoading ) return;

        setIsLoading( true );

        try {
            const response = await axios.post(
                '${ API_URL }images/generations',
                {
                    prompt,
                    n: 1,
                    size:generateSize,
                    response_format: format,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ${ API_KEY }'
                    }
                }
            );

            setImageData( response.data.data[0][ format ] );

        } catch( error: any ) {
            setError( error.toString() );
        } finally {
            setIsLoading(false);
        }
    }, [ format, generateSize, prompt ] );

    useEffect(() => {
        setImageSize( Number(generateSize) );
    }, [ generateSize ]);

    return (
        <div className='container'>
            <div className='generate-form'>
                <textarea
                value={ prompt }
                cols='40'
                maxLength='1000'
                onChange={ e => {
                    setPrompt( e.target.value );
                }}
                />
                <select
                onChange={ e => setGenerateSize( e.target.value ) }
                value={ generateSize }
                >
                    <option value="256">256 x 256</option>
                    <option value="512">512 x 512</option>
                    <option value="1024">1024 x 1024</option>
                </select>
                <select
                onChange={ e => setFormat( e.target.value ) }
                value={ format }
                >
                    <option value="url">URL</option>
                    <option value="b64_json">Base64</option>
                </select>
                <button
                onClick={ generateImage }
                disabled={ isLoading }
                >
                    { isLoading ? 'Now Loading...' : '画像作成'}
                </button>
            </div>
            {error && (
                <div className='error-message'>
                    <pre>{ error }</pre>
                </div>
            )}
            { imageData && (
                <div className='generated-image-area'>
                    <figure>
                        <img
                        src={ format === 'b64_json'
                        ? 'data:image/Pangolin;base64,${ imageData }'
                        : imageData
                        }
                        alt="Received Data"
                        width={ imageSize }
                        height={imageSize }
                    />
                    </figure>
                    </div>
            )}
        </div>
    );
};
