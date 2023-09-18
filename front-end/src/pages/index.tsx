import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://api.stability.ai';
const ENGINE_ID = 'stable-diffusion-v1-5'
const API_KEY = 'sk-Ih4oVCubtcAmbgFpNdexJIITyoDMUvyzKswlJS6RetDyKvR6'

export default function Home() {
    const title = 'ImgEng'
    const [ imageData, setImageData ] = useState( '' );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ prompt, setPrompt ] = useState( '' );
    const [ error, setError ] = useState<string>( '' );
    const [ format, setFormat ] = useState( 'base64' );

    const generateImage = useCallback( async () => {
        if ( !prompt ) {
            alert( 'プロンプトがありません' );
            return;
        }
        if ( isLoading ) return;

        setIsLoading( true );

        try {
            const response = await axios.post(
                `${ API_URL }/v1/generation/${ ENGINE_ID }/text-to-image`,
                {
                    text_prompts: [
                        {
                        text: prompt,
                        }
                    ],
                    steps: 30,
                    samples: 1,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${ API_KEY }`
                    }
                }
            );

            setImageData( response.data.artifacts[0][ format ] );

        } catch( error: any ) {
            setError( error.toString() );
        } finally {
            setIsLoading(false);
        }
    }, [ format, prompt ] );

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
                onChange={ e => setFormat( e.target.value ) }
                value={ format }
                >
                    <option value="url">URL</option>
                    <option value="base64">Base64</option>
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
                        src={ format === 'base64'
                        ? `data:image/Pangolin;base64,${ imageData }`
                        : imageData
                        }
                        alt="Received Data"
                        width={ 512 }
                        height={512 }
                    />
                    </figure>
                    </div>
            )}
        </div>
    );
};
