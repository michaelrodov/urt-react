/**
 * Created by rodov on 28/07/2016.
 */
import ReactGA from 'react-ga';

export default {
    uaId: 'UA-92784545-1',
    tenant: '',
    init: function () {
        ReactGA.initialize(this.uaId);
    },
    report: {
        /**
         * event:
         * GA event tracking
         * @param args.category {String} required
         * @param args.action {String} required
         * @param args.label {String} optional
         * @param args.value {Int} optional
         * @param args.nonInteraction {boolean} optional
         */
        event: function (tenant, action, label, value, nonInteraction) {
            ReactGA.event({category: tenant, action: action, label, value, nonInteraction});
        },
        /***
         * Send a pageview
         * @param pageName - page that we are on
         */
        pageview: function (tenant, pageName) {
            ReactGA.pageview(tenant + "/" + pageName);
        }
    }
};

