import React from 'react';

const Page404 = () => {
    return (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
            <style jsx>
                {
                    `
                    @media (max-width: 640px) {
                        h1 {
                            font-size: 1em;
                        }
                    }
                    `
                }
            </style>
            <h1>Could not find the page you were looking for.</h1>
        </div>
    );
}

export default Page404;
