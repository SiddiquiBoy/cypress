import gql from 'graphql-tag';
export class AddCompanyMutations {

  static readonly CREATE_ORGANIZATION = gql`
  mutation createOrganization($createOrganizationDto: OrganizationCreateDto!) {
    createOrganization(createOrganizationDto: $createOrganizationDto) {
      id
    }
  }
  `;

  static readonly UPDATE_ORGANIZATION = gql`
  mutation updateOrganization($updateOrganizationDto: OrganizationUpdateDto!) {
    updateOrganization(updateOrganizationDto: $updateOrganizationDto) {
      id
    }
  }
  `;

  static readonly IF_COMPANY_CONTACT_ALREADY_EXISTS = gql`
  mutation checkIfOrganizationTaken($organizationId: String, $contact: String, $email: String) {
    checkIfOrganizationTaken(organizationId: $organizationId, contact: $contact, email: $email)
  }
  `;

}
