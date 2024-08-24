import React from 'react';

function Footer() {
  return (
    <footer className="page-footer mt-5">
			<div className="container text-center">
				<div className="row">
					<div className="col-md-12">
						<h5 className="white-text">Attention !</h5>
						<p className="grey-text text-lighten-4">This system is in-development, and the features and
							operation of the page will vary over time. It is designed to demonstrate the Agent Sales
							Production Report over a 24-month period. The search functions are not optimized, yet.
							Therefore the results may take up to a minute to display. Before starting your search, make
							sure to Clear the fields using the labeled button</p>
					</div>
				</div>
			</div>
			<div className="footer-copyright">
				<div className="container">
          <div className="row">
            <div className="col text-left">© 2023 Copyright CREMS</div>
            <div className="col text-right"><a className="text-light text-lighten-4 " href="#!">web site</a></div>
        </div>                  
				</div>
			</div>
		</footer>
  );
};

export default Footer;
