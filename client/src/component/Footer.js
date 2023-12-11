import { social1 } from './data';

function Footer() {


    return (
        <>
        <div className="Footer">
            <p>
                <h3>Links to social media accounts</h3>
                {/* social icons */}
                <ul className='social-icons'>
                  {social1.map((socialIcon) => {
                    const { id, url, icon } = socialIcon;
                    return (
                      <li key={id}>
                        <a href={url}>{icon}</a>
                      </li>
                    );
                  })}
                </ul>
            </p>
            </div>
        </>
    )
}

export default Footer;