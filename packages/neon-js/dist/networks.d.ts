declare const _default: {
    MainNet: {
        Name: string;
        ProtocolConfiguration: {
            Magic: number;
            AddressVersion: number;
            StandbyValidators: string[];
            SeedList: string[];
            SystemFee: {
                EnrollmentTransaction: number;
                IssueTransaction: number;
                PublishTransaction: number;
                RegisterTransaction: number;
            };
        };
        ExtraConfiguration: {
            neonDB: string;
            neoscan: string;
        };
    };
    TestNet: {
        Name: string;
        ProtocolConfiguration: {
            Magic: number;
            AddressVersion: number;
            StandbyValidators: string[];
            SeedList: string[];
            SystemFee: {
                EnrollmentTransaction: number;
                IssueTransaction: number;
                PublishTransaction: number;
                RegisterTransaction: number;
            };
        };
        ExtraConfiguration: {
            neonDB: string;
            neoscan: string;
        };
    };
    CozNet: {
        Name: string;
        ProtocolConfiguration: {
            Magic: number;
            AddressVersion: number;
            StandbyValidators: string[];
            SeedList: string[];
            SystemFee: {
                EnrollmentTransaction: number;
                IssueTransaction: number;
                PublishTransaction: number;
                RegisterTransaction: number;
            };
        };
        ExtraConfiguration: {
            neoscan: string;
        };
    };
};
export default _default;
//# sourceMappingURL=networks.d.ts.map