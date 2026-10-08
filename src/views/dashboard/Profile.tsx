'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../layout/Sidebar';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';
import { updateCustomerProfile } from '../../APIs/api';

export interface SavedAddress {
  id: number;
  type: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export const Profile = () => {
  const { user, updateProfile, profileLoaded, profileLoadError } = useBooking();

  // Extract first and last name from user
  const initialFirstName = user.firstName || (user.name ? user.name.split(' ')[0] : '');
  const initialLastName = user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : '');

  // Personal Details State
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(user.email || '');
  const phone = user.phone || '';

  // Addresses State (Multiple Addresses)
  const defaultSavedAddresses: SavedAddress[] = user.savedAddresses?.length
    ? user.savedAddresses
    : [
        {
          id: 1,
          type: 'Home',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
          country: user.address?.country || '',
          isDefault: true
        }
      ];

  const [addresses, setAddresses] = useState<SavedAddress[]>(defaultSavedAddresses);

  useEffect(() => {
    if (!profileLoaded || profileLoadError) return;
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setEmail(user.email || '');
    setAddresses(user.savedAddresses || []);
  }, [profileLoaded, profileLoadError, user.firstName, user.lastName, user.email, user.savedAddresses]);

  // New Address Form State
  const [newAddressType, setNewAddressType] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newCountry, setNewCountry] = useState('India');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // New Traveler Form State
  const [newTraveller, setNewTraveller] = useState({
    name: '',
    age: '',
    gender: 'Male',
    idType: 'Aadhaar',
    idNumber: ''
  });

  // Handle Update Personal Details
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || firstName.trim().length < 3 || !lastName.trim() || lastName.trim().length < 3) {
      toast.error('First and last names must each be at least 3 characters.');
      return;
    }
    if (!user.address?.country || !user.address?.state || !user.address?.city) {
      toast.error('Add your country, state, and city before saving your profile.');
      return;
    }
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    try {
      await updateCustomerProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || undefined,
        country: user.address.country,
        state: user.address.state,
        city: user.address.city,
        pincode: user.address.pincode || '',
        address: user.address.street || '',
      });
      updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName,
        email: email.trim(),
      });
      toast.success('Personal details updated successfully!');
    } catch (error) {
      console.error('Customer profile update failed:', error);
      toast.error(error.response?.data?.message || 'Could not update your profile.');
    }
  };

  // Handle Add New Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim() || !newPincode.trim()) {
      toast.error('Please fill in street address, city, and pincode.');
      return;
    }

    const isFirstAddress = addresses.length === 0;
    const shouldBeDefault = newIsDefault || isFirstAddress;

    const newAddr: SavedAddress = {
      id: Date.now(),
      type: newAddressType,
      street: newStreet.trim(),
      city: newCity.trim(),
      state: newState.trim() || 'Ladakh (UT)',
      pincode: newPincode.trim(),
      country: newCountry.trim() || 'India',
      isDefault: shouldBeDefault
    };

    let updatedAddresses = [...addresses];
    if (shouldBeDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddr);

    setAddresses(updatedAddresses);
    updateProfile({
      savedAddresses: updatedAddresses,
      address: shouldBeDefault
        ? {
            street: newAddr.street,
            city: newAddr.city,
            state: newAddr.state,
            pincode: newAddr.pincode,
            country: newAddr.country
          }
        : user.address
    });

    toast.success('New address added successfully!');

    // Reset Form
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPincode('');
    setNewCountry('India');
    setNewAddressType('Home');
    setNewIsDefault(false);
  };

  // Handle Remove Address
  const handleRemoveAddress = (id: number) => {
    const updated = addresses.filter((a) => a.id !== id);
    // If the removed address was default and there are remaining addresses, make the first one default
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    const defaultAddr = updated.find((a) => a.isDefault) || updated[0];
    updateProfile({
      savedAddresses: updated,
      address: defaultAddr
        ? {
            street: defaultAddr.street,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
            country: defaultAddr.country
          }
        : undefined
    });
    toast.success('Address removed.');
  };

  // Handle Set Default Address
  const handleSetDefaultAddress = (id: number) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
    const defaultAddr = updated.find((a) => a.id === id);
    if (defaultAddr) {
      updateProfile({
        savedAddresses: updated,
        address: {
          street: defaultAddr.street,
          city: defaultAddr.city,
          state: defaultAddr.state,
          pincode: defaultAddr.pincode,
          country: defaultAddr.country
        }
      });
    }
    toast.success('Default address updated!');
  };

  // Handle Add Traveler
  const handleAddTraveller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraveller.name || !newTraveller.age || !newTraveller.idNumber) {
      toast.error('Please enter all traveler details.');
      return;
    }
    const currentList = user.savedTravellers || [];
    const newList = [...currentList, { ...newTraveller, id: Date.now() }];
    updateProfile({ savedTravellers: newList });
    toast.success('Traveler profile saved!');
    setNewTraveller({ name: '', age: '', gender: 'Male', idType: 'Aadhaar', idNumber: '' });
  };

  // Handle Remove Traveler
  const handleRemoveTraveller = (id: number) => {
    const currentList = user.savedTravellers || [];
    const newList = currentList.filter((t: any) => t.id !== id);
    updateProfile({ savedTravellers: newList });
    toast.success('Traveler profile removed.');
  };

  return (
    <div className="container py-4">
      <div className="dashboard-outer-wrapper">
        <div className="dashboard-layout">
          <Sidebar />

          <div className="dashboard-content">
            <h4 className="fw-bold mb-4">Profile Details</h4>

            <div className="row g-4">
              {/* Left Column: Personal Details & Multiple Addresses */}
              <div className="col-12 col-lg-6">
                {/* 1. Personal Details Card */}
                <div className="border rounded-3 p-3 bg-light mb-4">
                  <h5 className="fw-bold text-dark mb-3">
                    <i className="fa-solid fa-user-pen me-2"></i> Personal Details
                  </h5>
                  <form onSubmit={handleUpdateProfile}>
                    {/* First Name & Last Name */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label fs-7 fw-semibold">First Name</label>
                        <input
                          type="text"
                          className="form-control fs-7"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fs-7 fw-semibold">Last Name</label>
                        <input
                          type="text"
                          className="form-control fs-7"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Email ID */}
                    <div className="mb-3">
                      <label className="form-label fs-7 fw-semibold">Email ID</label>
                      <input
                        type="email"
                        className="form-control fs-7"
                        placeholder="Email ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    {/* Mobile Number (Non-editable after login) */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label fs-7 fw-semibold mb-0">Mobile Number</label>
                        <span className="badge bg-secondary-subtle text-secondary fs-9 d-inline-flex align-items-center gap-1 border">
                          <i className="fa-solid fa-lock fs-9"></i> Verified & Locked
                        </span>
                      </div>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control fs-7 bg-light text-muted"
                          value={phone}
                          readOnly
                          disabled
                          style={{
                            cursor: 'not-allowed',
                            backgroundColor: '#f1f3f5',
                            opacity: 0.95
                          }}
                        />
                      </div>
                      <small className="text-muted fs-9 d-block mt-1">
                        <i className="fa-solid fa-circle-info me-1"></i> Mobile number login ke baad edit nahi kiya ja sakta.
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-premium-primary py-2 w-100 justify-content-center"
                    >
                      <i className="fa-solid fa-floppy-disk me-1"></i> Save Changes
                    </button>
                  </form>
                </div>

                {/* 2. Multiple Address & Location Card */}
                <div className="border rounded-3 p-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">
                      <i className="fa-solid fa-location-dot text-danger me-1.5"></i> Address & Location
                    </h5>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill fs-9 px-2 py-0.5">
                      <i className="fa-solid fa-circle-check me-1"></i> {addresses.length} Saved
                    </span>
                  </div>

                  {/* List of Saved Addresses */}
                  <div className="d-flex flex-column gap-2 mb-3">
                    {addresses.map((addr) => (
                      <div
                        className="bg-white p-3 rounded-3 border position-relative shadow-sm"
                        key={addr.id}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary-subtle text-primary fw-bold fs-9 px-2 py-0.5">
                              {addr.type === 'Office' || addr.type === 'Work' ? (
                                <i className="fa-solid fa-briefcase me-1"></i>
                              ) : (
                                <i className="fa-solid fa-house me-1"></i>
                              )}
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="badge bg-success text-white fs-9">
                                <i className="fa-solid fa-check me-1"></i> Default
                              </span>
                            )}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="btn btn-sm btn-link text-decoration-none fs-9 p-0 text-primary fw-semibold"
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveAddress(addr.id)}
                              className="btn btn-sm btn-link text-danger p-0 border-0"
                              title="Delete Address"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>

                        <div className="fw-semibold text-dark fs-7 mt-1.5">{addr.street}</div>
                        <div className="text-muted fs-8">
                          {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-3" />

                  {/* Form to Add New Address */}
                  <h6 className="fw-bold fs-7 mb-2 d-flex align-items-center gap-1.5">
                    <i className="fa-solid fa-plus-circle text-primary"></i> Add New Address
                  </h6>
                  <form onSubmit={handleAddAddress}>
                    <div className="mb-2">
                      <label className="form-label fs-8 fw-semibold mb-1">Address Type</label>
                      <select
                        className="form-select form-select-sm fs-8"
                        value={newAddressType}
                        onChange={(e) => setNewAddressType(e.target.value)}
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office / Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="form-label fs-8 fw-semibold mb-1">House / Flat / Street Address</label>
                      <input
                        type="text"
                        className="form-control form-control-sm fs-8"
                        placeholder="e.g. Flat 402, Himalayan Heights, Fort Road"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        required
                      />
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label fs-8 fw-semibold mb-1">City</label>
                        <input
                          type="text"
                          className="form-control form-control-sm fs-8"
                          placeholder="e.g. Leh"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fs-8 fw-semibold mb-1">State / UT</label>
                        <input
                          type="text"
                          className="form-control form-control-sm fs-8"
                          placeholder="e.g. Ladakh (UT)"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label fs-8 fw-semibold mb-1">Pincode</label>
                        <input
                          type="text"
                          className="form-control form-control-sm fs-8"
                          placeholder="e.g. 194101"
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fs-8 fw-semibold mb-1">Country</label>
                        <input
                          type="text"
                          className="form-control form-control-sm fs-8"
                          placeholder="India"
                          value={newCountry}
                          onChange={(e) => setNewCountry(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="makeDefaultAddress"
                        checked={newIsDefault}
                        onChange={(e) => setNewIsDefault(e.target.checked)}
                      />
                      <label className="form-check-label fs-8 text-muted" htmlFor="makeDefaultAddress">
                        Set as default address
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-premium-primary py-2 w-100 justify-content-center"
                    >
                      <i className="fa-solid fa-plus me-1"></i> Add Address
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Saved Travelers */}
              <div className="col-12 col-lg-6">
                <div className="border rounded-3 p-3 bg-light mb-3">
                  <h5 className="fw-bold text-dark mb-3">Saved Travelers</h5>
                  <div className="d-flex flex-column gap-2 mb-3">
                    {user.savedTravellers?.map((t: any) => (
                      <div
                        className="d-flex justify-content-between align-items-center bg-white p-2 rounded border"
                        key={t.id}
                      >
                        <div>
                          <div className="fw-bold fs-7">
                            {t.name} ({t.gender}, Age {t.age})
                          </div>
                          <small className="text-muted fs-8">
                            {t.idType}: {t.idNumber}
                          </small>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTraveller(t.id)}
                          className="btn btn-sm btn-link text-danger p-0 border-0"
                          title="Delete Traveler"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* Add new traveler */}
                  <h6 className="fw-bold fs-7 mb-2">Add New Traveler</h6>
                  <form onSubmit={handleAddTraveller}>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm fs-8"
                        placeholder="Name"
                        value={newTraveller.name}
                        onChange={(e) =>
                          setNewTraveller({ ...newTraveller, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm fs-8"
                          placeholder="Age"
                          value={newTraveller.age}
                          onChange={(e) =>
                            setNewTraveller({ ...newTraveller, age: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-6">
                        <select
                          className="form-select form-select-sm fs-8"
                          value={newTraveller.gender}
                          onChange={(e) =>
                            setNewTraveller({ ...newTraveller, gender: e.target.value })
                          }
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <select
                          className="form-select form-select-sm fs-8"
                          value={newTraveller.idType}
                          onChange={(e) =>
                            setNewTraveller({ ...newTraveller, idType: e.target.value })
                          }
                        >
                          <option value="Aadhaar">Aadhaar</option>
                          <option value="Passport">Passport</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control form-control-sm fs-8"
                          placeholder="ID Number"
                          value={newTraveller.idNumber}
                          onChange={(e) =>
                            setNewTraveller({ ...newTraveller, idNumber: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-premium-primary py-2 w-100 justify-content-center"
                    >
                      <i className="fa-solid fa-plus me-1"></i> Add Traveler
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
