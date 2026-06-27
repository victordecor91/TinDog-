import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, TextInput, Animated, PanResponder, Dimensions,
  StatusBar, SafeAreaView, Alert, Modal
} from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

/* ── COULEURS ── */
const C = {
  orange: '#E8642A',
  orangeLight: '#FFF0E8',
  dark: '#1A1A2E',
  white: '#FFFFFF',
  bg: '#F8F5F1',
  border: '#EDE8E2',
  gray: '#9CA3AF',
  grayLight: '#F0EDE8',
  green: '#16A34A',
  red: '#EF4444',
};

/* ── DONNÉES ── */
const PETS = [
  { id:1, name:'Luna', age:2, breed:'Golden Retriever', type:'dog', distance:'2 km',
    bio:"J'adore jouer à la balle et les balades en forêt 🌲", verified:true, pedigree:true,
    photo:'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&q=80' },
  { id:2, name:'Milo', age:3, breed:'Bouledogue Français', type:'dog', distance:'5 km',
    bio:'Champion de siestes et câlins. Cherche une âme sœur douce.', verified:false, pedigree:true,
    photo:'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&q=80' },
  { id:3, name:'Nala', age:1, breed:'Siberian Husky', type:'dog', distance:'8 km',
    bio:'Énergique, joueuse, un peu sauvage 🐺 Adore les grandes randonnées.', verified:true, pedigree:true,
    photo:'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=500&q=80' },
  { id:4, name:'Cléo', age:4, breed:'Chat Persan', type:'cat', distance:'1 km',
    bio:'Princesse en recherche de compagnie raffinée ✨', verified:true, pedigree:false,
    photo:'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=500&q=80' },
  { id:5, name:'Simba', age:2, breed:'Maine Coon', type:'cat', distance:'3 km',
    bio:'Grand seigneur cherche partenaire à la hauteur.', verified:false, pedigree:true,
    photo:'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500&q=80' },
  { id:6, name:'Bella', age:5, breed:'Labrador', type:'dog', distance:'4 km',
    bio:'Maman expérimentée, douce et équilibrée 🌸', verified:true, pedigree:true,
    photo:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80' },
];

const PLANS = [
  { id:'free', name:'Gratuit', price:'0€', period:'', icon:'🐾', color:C.gray,
    features:[{t:'Swipe illimité',ok:true},{t:'Messagerie basique',ok:true},{t:'Voir qui vous a liké',ok:false},{t:'Saillie chien de race',ok:false},{t:'Badge Vérifié',ok:false}] },
  { id:'premium', name:'Premium', price:'9,99€', period:'/mois', icon:'💎', color:C.orange, popular:true,
    features:[{t:'Swipe illimité',ok:true},{t:'Messagerie avancée',ok:true},{t:'Voir qui vous a liké ❤️',ok:true},{t:'Saillie chien de race',ok:false},{t:'Badge Vérifié',ok:true}] },
  { id:'breeding', name:'Saillie Pro', price:'24,99€', period:'/mois', icon:'🏆', color:C.dark,
    features:[{t:'Tout Premium inclus',ok:true},{t:'Annonces saillie illimitées',ok:true},{t:'Filtres race & pedigree',ok:true},{t:'Carnet de santé numérique',ok:true},{t:'Support prioritaire',ok:true}] },
];

const LIKES = [
  { id:101, name:'Rex', breed:'Berger Allemand', blurred:true,
    photo:'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&q=80' },
  { id:102, name:'Lily', breed:'Ragdoll', blurred:true,
    photo:'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=300&q=80' },
  { id:103, name:'Thor', breed:'Rottweiler', blurred:true,
    photo:'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=300&q=80' },
  { id:104, name:'Perle', breed:'Bichon Frisé', blurred:false,
    photo:'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=300&q=80' },
];

const MESSAGES = [
  { id:1, from:'Bella', text:'Woof! Tu veux jouer ? 🎾', time:'10:32', unread:true,
    photo:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&q=80' },
  { id:2, from:'Cléo', text:'Miaou... je t\'attends 😺', time:'Hier', unread:false,
    photo:'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=100&q=80' },
];

/* ── COMPOSANT LOGO PATTE ── */
function PawIcon({ size = 28, color = C.orange }) {
  return <Text style={{ fontSize: size * 0.8 }}>🐾</Text>;
}

/* ── ÉCRAN LOGIN ── */
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <SafeAreaView style={s.loginBg}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      <ScrollView contentContainerStyle={s.loginScroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={s.logoRow}>
          <Text style={s.logoPaw}>🐾</Text>
          <Text style={s.logoText}>TinDog</Text>
        </View>
        <Text style={s.logoSub}>Trouvez le partenaire idéal pour votre animal</Text>

        {/* Tab toggle */}
        <View style={s.tabToggle}>
          {['login','register'].map(m => (
            <TouchableOpacity key={m} onPress={() => setMode(m)}
              style={[s.tabBtn, mode === m && s.tabBtnActive]}>
              <Text style={[s.tabBtnText, mode === m && s.tabBtnTextActive]}>
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fields */}
        <TextInput style={s.input} placeholder="Email" placeholderTextColor={C.gray}
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
        <TextInput style={s.input} placeholder="Mot de passe" placeholderTextColor={C.gray}
          value={pass} onChangeText={setPass} secureTextEntry/>
        {mode === 'register' &&
          <TextInput style={s.input} placeholder="Confirmer le mot de passe"
            placeholderTextColor={C.gray} secureTextEntry/>}

        <TouchableOpacity style={s.btnPrimary} onPress={onLogin} activeOpacity={0.85}>
          <Text style={s.btnPrimaryText}>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={s.dividerRow}>
          <View style={s.dividerLine}/><Text style={s.dividerText}>ou</Text><View style={s.dividerLine}/>
        </View>

        <TouchableOpacity style={s.btnGoogle} onPress={onLogin} activeOpacity={0.85}>
          <Text style={s.btnGoogleText}>🇬 Continuer avec Google</Text>
        </TouchableOpacity>

        {mode === 'login' &&
          <TouchableOpacity style={{ marginTop: 16, alignSelf: 'center' }}>
            <Text style={{ color: C.orange, fontWeight: '600', fontSize: 14 }}>Mot de passe oublié ?</Text>
          </TouchableOpacity>}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── CARTE SWIPEABLE ── */
function SwipeCard({ pet, onSwipe }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = pan.x.interpolate({ inputRange: [-W, 0, W], outputRange: ['-20deg', '0deg', '20deg'] });
  const likeOpacity = pan.x.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = pan.x.interpolate({ inputRange: [-80, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > 100) {
        Animated.timing(pan, { toValue: { x: W * 1.5, y: g.dy }, duration: 300, useNativeDriver: false }).start(() => onSwipe('right'));
      } else if (g.dx < -100) {
        Animated.timing(pan, { toValue: { x: -W * 1.5, y: g.dy }, duration: 300, useNativeDriver: false }).start(() => onSwipe('left'));
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      }
    },
  })).current;

  return (
    <Animated.View style={[s.card, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] }]}
      {...panResponder.panHandlers}>
      <Image source={{ uri: pet.photo }} style={s.cardImg} resizeMode="cover"/>
      {/* Gradient simulé */}
      <View style={s.cardGradient}>
        {/* Badges */}
        <View style={s.badgeRow}>
          {pet.verified && <View style={s.badge}><Text style={[s.badgeText,{color:C.green}]}>✓ Vérifié</Text></View>}
          {pet.pedigree && <View style={s.badge}><Text style={[s.badgeText,{color:C.orange}]}>🏅 Pedigree</Text></View>}
        </View>
        {/* Like / Nope overlays */}
        <Animated.View style={[s.likeLabel, { opacity: likeOpacity }]}>
          <Text style={s.likeLabelText}>J'aime ❤️</Text>
        </Animated.View>
        <Animated.View style={[s.nopeLabel, { opacity: nopeOpacity }]}>
          <Text style={s.nopeLabelText}>Passer ✕</Text>
        </Animated.View>
      </View>
      {/* Info */}
      <View style={s.cardInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
          <Text style={s.cardName}>{pet.name}</Text>
          <Text style={s.cardAge}>{pet.age} ans</Text>
        </View>
        <Text style={s.cardBreed}>🐾 {pet.breed}  📍 {pet.distance}</Text>
        <Text style={s.cardBio} numberOfLines={2}>{pet.bio}</Text>
      </View>
    </Animated.View>
  );
}

/* ── APP PRINCIPALE ── */
export default function App() {
  const [screen, setScreen] = useState('login');
  const [tab, setTab] = useState('discover');
  const [petIndex, setPetIndex] = useState(0);
  const [match, setMatch] = useState(null);
  const [activePlan, setActivePlan] = useState('free');
  const [filter, setFilter] = useState('all');
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallType, setPaywallType] = useState('premium');

  const filteredPets = PETS.filter(p => filter === 'all' || p.type === filter);
  const pet = filteredPets[petIndex] || null;

  const handleSwipe = dir => {
    if (dir === 'right' && Math.random() > 0.45) setMatch(pet);
    else setPetIndex(i => i + 1);
  };

  const openPaywall = type => { setPaywallType(type); setShowPaywall(true); };

  if (screen === 'login') return <LoginScreen onLogin={() => setScreen('main')}/>;

  return (
    <SafeAreaView style={s.appBg}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white}/>

      {/* HEADER */}
      <View style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 22 }}>🐾</Text>
          <Text style={s.headerTitle}>TinDog</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {activePlan === 'free'
            ? <TouchableOpacity style={s.premiumBtn} onPress={() => openPaywall('premium')}>
                <Text style={s.premiumBtnText}>💎 Premium</Text>
              </TouchableOpacity>
            : <View style={s.premiumActive}>
                <Text style={{ color: C.orange, fontSize: 12, fontWeight: '700' }}>
                  {activePlan === 'premium' ? '💎 Premium' : '🏆 Saillie Pro'}
                </Text>
              </View>}
        </View>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1 }}>

        {/* ── DISCOVER ── */}
        {tab === 'discover' && (
          <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12, flexGrow: 0 }}>
              {[['all','🐾 Tous'],['dog','🐕 Chiens'],['cat','🐱 Chats']].map(([f,l]) => (
                <TouchableOpacity key={f} onPress={() => { setFilter(f); setPetIndex(0); }}
                  style={[s.filterBtn, filter === f && s.filterBtnActive]}>
                  <Text style={[s.filterBtnText, filter === f && { color: C.white }]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {pet ? (
              <View style={{ flex: 1 }}>
                <SwipeCard key={pet.id} pet={pet} onSwipe={handleSwipe}/>
                {/* Buttons */}
                <View style={s.actionRow}>
                  <TouchableOpacity style={[s.actionBtn, { borderColor: '#FECACA' }]}
                    onPress={() => handleSwipe('left')}>
                    <Text style={{ fontSize: 24 }}>✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.actionBtn, { borderColor: '#FDE68A', width: 46, height: 46 }]}
                    onPress={() => openPaywall('premium')}>
                    <Text style={{ fontSize: 18 }}>⭐</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.actionBtn, { backgroundColor: C.orange, borderColor: C.orange }]}
                    onPress={() => handleSwipe('right')}>
                    <Text style={{ fontSize: 24 }}>❤️</Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.swipeHint}>Glisse la carte ou utilise les boutons</Text>
              </View>
            ) : (
              <View style={s.emptyState}>
                <Text style={{ fontSize: 60, marginBottom: 12 }}>🐾</Text>
                <Text style={s.emptyText}>Plus de profils disponibles.{'\n'}Revenez plus tard !</Text>
                <TouchableOpacity style={[s.btnPrimary, { marginTop: 20, paddingHorizontal: 32 }]}
                  onPress={() => setPetIndex(0)}>
                  <Text style={s.btnPrimaryText}>Recommencer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── LIKES ── */}
        {tab === 'likes' && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Text style={s.sectionTitle}>❤️ Qui vous a liké</Text>
            {activePlan === 'free' && (
              <View style={s.paywallBanner}>
                <View>
                  <Text style={{ color: C.orange, fontWeight: '700', fontSize: 13 }}>💎 Débloquez vos likes</Text>
                  <Text style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>Passez Premium pour les voir</Text>
                </View>
                <TouchableOpacity style={s.bannerBtn} onPress={() => openPaywall('premium')}>
                  <Text style={{ color: C.white, fontWeight: '700', fontSize: 13 }}>Voir</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={s.likeGrid}>
              {LIKES.map(l => (
                <View key={l.id} style={s.likeCard}>
                  <View style={{ height: 130, overflow: 'hidden' }}>
                    <Image source={{ uri: l.photo }} style={[s.likeImg, l.blurred && activePlan === 'free' && { opacity: 0.15 }]}/>
                    {l.blurred && activePlan === 'free' &&
                      <View style={s.lockOverlay}><Text style={{ fontSize: 22 }}>🔒</Text></View>}
                  </View>
                  <View style={{ padding: 10 }}>
                    <Text style={s.likeName}>{l.blurred && activePlan === 'free' ? '???' : l.name}</Text>
                    <Text style={s.likeBreed}>{l.breed}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ── MESSAGES ── */}
        {tab === 'messages' && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Text style={s.sectionTitle}>💬 Messages</Text>
            {MESSAGES.map(m => (
              <TouchableOpacity key={m.id} style={[s.msgCard, m.unread && { borderColor: '#FDDDD0', borderWidth: 1.5 }]}>
                <Image source={{ uri: m.photo }} style={s.msgAvatar}/>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={s.msgName}>{m.from}</Text>
                    <Text style={s.msgTime}>{m.time}</Text>
                  </View>
                  <Text style={s.msgText} numberOfLines={1}>{m.text}</Text>
                </View>
                {m.unread && <View style={s.unreadDot}/>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── PLANS ── */}
        {tab === 'subscription' && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
            <Text style={s.sectionTitle}>🏅 Abonnements</Text>
            <Text style={{ color: C.gray, fontSize: 13, marginBottom: 16 }}>Choisissez le plan de votre compagnon</Text>
            {PLANS.map(plan => (
              <View key={plan.id} style={[s.planCard, activePlan === plan.id && { borderColor: plan.color, borderWidth: 2, backgroundColor: '#FFFAF8' }]}>
                {plan.popular && (
                  <View style={[s.popularBadge, { backgroundColor: plan.color }]}>
                    <Text style={{ color: C.white, fontSize: 10, fontWeight: '800' }}>⭐ POPULAIRE</Text>
                  </View>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Text style={{ fontSize: 20 }}>{plan.icon}</Text>
                      <Text style={s.planName}>{plan.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                      <Text style={[s.planPrice, { color: plan.id === 'free' ? C.gray : C.orange }]}>{plan.price}</Text>
                      <Text style={s.planPeriod}>{plan.period}</Text>
                    </View>
                  </View>
                  {activePlan === plan.id
                    ? <View style={[s.activeTag, { borderColor: plan.color }]}>
                        <Text style={{ color: plan.color, fontSize: 12, fontWeight: '700' }}>✓ Actif</Text>
                      </View>
                    : <TouchableOpacity style={[s.choosBtn, { backgroundColor: plan.id === 'free' ? C.grayLight : plan.id === 'premium' ? C.orange : C.dark }]}
                        onPress={() => { setActivePlan(plan.id); }}>
                        <Text style={{ color: plan.id === 'free' ? C.gray : C.white, fontWeight: '700', fontSize: 13 }}>Choisir</Text>
                      </TouchableOpacity>}
                </View>
                {plan.features.map((f, i) => (
                  <View key={i} style={s.featureRow}>
                    <Text style={{ fontSize: 14 }}>{f.ok ? '✅' : '❌'}</Text>
                    <Text style={[s.featureText, !f.ok && { color: C.gray }]}>{f.t}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* BOTTOM NAV */}
      <View style={s.bottomNav}>
        {[['discover','🐾','Découvrir'],['likes','❤️','Likes'],['messages','💬','Messages'],['subscription','🏅','Plans']].map(([id,icon,label]) => (
          <TouchableOpacity key={id} onPress={() => setTab(id)} style={s.navBtn}>
            <Text style={[{ fontSize: 22 }, tab !== id && { opacity: 0.35 }]}>{icon}</Text>
            <Text style={[s.navLabel, tab === id && { color: C.orange }]}>{label}</Text>
            {tab === id && <View style={s.navDot}/>}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── MATCH MODAL ── */}
      <Modal visible={!!match} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.matchBox}>
            <Text style={{ fontSize: 50, marginBottom: 8 }}>🎉</Text>
            <Text style={s.matchTitle}>C'est un Match !</Text>
            <Text style={s.matchSub}>Vous et <Text style={{ color: C.dark, fontWeight: '800' }}>{match?.name}</Text> vous êtes plu mutuellement 🐾</Text>
            {match && <Image source={{ uri: match.photo }} style={s.matchImg}/>}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity style={s.matchBtnSecondary} onPress={() => { setMatch(null); setPetIndex(i => i+1); }}>
                <Text style={{ color: C.gray, fontWeight: '700' }}>Continuer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.matchBtnPrimary} onPress={() => { setMatch(null); setPetIndex(i => i+1); setTab('messages'); }}>
                <Text style={{ color: C.white, fontWeight: '700' }}>💬 Envoyer un message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── PAYWALL MODAL ── */}
      <Modal visible={showPaywall} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.paywallBox}>
            <TouchableOpacity style={s.closeBtn} onPress={() => setShowPaywall(false)}>
              <Text style={{ color: C.gray, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 50, marginBottom: 10 }}>{paywallType === 'premium' ? '💎' : '🏆'}</Text>
            <Text style={s.paywallTitle}>{paywallType === 'premium' ? 'TinDog Premium' : 'Saillie Pro'}</Text>
            <Text style={s.paywallSub}>
              {paywallType === 'premium'
                ? 'Découvrez tous ceux qui ont flashé sur votre compagnon'
                : 'Pour les éleveurs et passionnés de races pures'}
            </Text>
            <View style={s.featureBox}>
              {(paywallType === 'premium'
                ? ['Voir tous vos likes 👀','Super Likes illimités ⭐','Badge Vérifié ✓','Rewind — annuler un swipe ↩️']
                : ['Annonces saillie illimitées 🐕','Filtre race & LOF/pedigree 📋','Carnet de santé numérique 🏥','Mise en avant des profils ⭐','Support éleveur prioritaire 📞']
              ).map((f, i) => (
                <View key={i} style={s.featureRow}>
                  <View style={[s.featureDot, { backgroundColor: paywallType === 'premium' ? C.orange : C.dark }]}/>
                  <Text style={s.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[s.btnPrimary, { backgroundColor: paywallType === 'premium' ? C.orange : C.dark }]}
              onPress={() => { setActivePlan(paywallType); setShowPaywall(false); }}>
              <Text style={s.btnPrimaryText}>
                {paywallType === 'premium' ? 'S\'abonner — 9,99€/mois' : 'S\'abonner — 24,99€/mois'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ── STYLES ── */
const s = StyleSheet.create({
  // Login
  loginBg: { flex: 1, backgroundColor: C.white },
  loginScroll: { padding: 28, paddingTop: 60 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 },
  logoPaw: { fontSize: 40 },
  logoText: { fontSize: 36, fontWeight: '900', color: C.dark, letterSpacing: -1 },
  logoSub: { color: C.gray, fontSize: 15, textAlign: 'center', marginBottom: 40 },
  tabToggle: { flexDirection: 'row', backgroundColor: C.grayLight, borderRadius: 14, padding: 4, marginBottom: 24 },
  tabBtn: { flex: 1, paddingVertical: 12, borderRadius: 11, alignItems: 'center' },
  tabBtnActive: { backgroundColor: C.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabBtnText: { color: C.gray, fontWeight: '700', fontSize: 15 },
  tabBtnTextActive: { color: C.dark },
  input: { borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 16, fontSize: 16, color: C.dark, backgroundColor: '#F8F6F3', marginBottom: 14 },
  btnPrimary: { backgroundColor: C.orange, borderRadius: 14, padding: 17, alignItems: 'center', shadowColor: C.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  btnPrimaryText: { color: C.white, fontSize: 17, fontWeight: '800' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { color: C.gray, fontSize: 14 },
  btnGoogle: { borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 15, alignItems: 'center', backgroundColor: C.white },
  btnGoogleText: { color: C.dark, fontSize: 15, fontWeight: '600' },
  // App
  appBg: { flex: 1, backgroundColor: C.bg },
  header: { backgroundColor: C.white, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontSize: 22, fontWeight: '900', color: C.dark, letterSpacing: -0.5 },
  premiumBtn: { backgroundColor: C.orange, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  premiumBtnText: { color: C.white, fontSize: 12, fontWeight: '700' },
  premiumActive: { backgroundColor: C.orangeLight, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  // Filters
  filterBtn: { backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginRight: 8 },
  filterBtnActive: { backgroundColor: C.orange, borderColor: C.orange },
  filterBtnText: { color: C.gray, fontSize: 13, fontWeight: '700' },
  // Card
  card: { width: '100%', height: H * 0.55, borderRadius: 24, overflow: 'hidden', backgroundColor: C.grayLight, position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 6 },
  cardImg: { width: '100%', height: '100%', position: 'absolute' },
  cardGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' },
  badgeRow: { position: 'absolute', top: 14, left: 14, flexDirection: 'row', gap: 6 },
  badge: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  likeLabel: { position: 'absolute', top: 28, left: 20, borderWidth: 3, borderColor: '#4ADE80', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 5, transform: [{ rotate: '-12deg' }] },
  likeLabelText: { color: '#4ADE80', fontSize: 22, fontWeight: '900' },
  nopeLabel: { position: 'absolute', top: 28, right: 20, borderWidth: 3, borderColor: C.red, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 5, transform: [{ rotate: '12deg' }] },
  nopeLabelText: { color: C.red, fontSize: 22, fontWeight: '900' },
  cardInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18, backgroundColor: 'rgba(0,0,0,0)', backgroundGradient: 'transparent' },
  cardName: { color: C.white, fontSize: 26, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  cardAge: { color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: '600' },
  cardBreed: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 4 },
  cardBio: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18 },
  // Action buttons
  actionRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, paddingVertical: 14 },
  actionBtn: { width: 58, height: 58, borderRadius: 29, backgroundColor: C.white, borderWidth: 2, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  swipeHint: { textAlign: 'center', color: C.gray, fontSize: 11, paddingBottom: 6 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: C.gray, textAlign: 'center', fontSize: 15, lineHeight: 22 },
  // Likes
  sectionTitle: { color: C.dark, fontSize: 20, fontWeight: '800', marginBottom: 12 },
  paywallBanner: { backgroundColor: '#FFF8F5', borderWidth: 1.5, borderColor: '#FDDDD0', borderRadius: 16, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerBtn: { backgroundColor: C.orange, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 9 },
  likeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  likeCard: { width: (W - 44) / 2, backgroundColor: C.white, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  likeImg: { width: '100%', height: 130, resizeMode: 'cover' },
  lockOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  likeName: { color: C.dark, fontWeight: '700', fontSize: 14 },
  likeBreed: { color: C.gray, fontSize: 11, marginTop: 2 },
  // Messages
  msgCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: C.white, borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  msgAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: C.border },
  msgName: { color: C.dark, fontWeight: '700', fontSize: 15 },
  msgTime: { color: C.gray, fontSize: 11 },
  msgText: { color: C.gray, fontSize: 13, marginTop: 2 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.orange },
  // Plans
  planCard: { backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1, position: 'relative' },
  popularBadge: { position: 'absolute', top: -11, right: 16, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 3 },
  planName: { color: C.dark, fontWeight: '800', fontSize: 17 },
  planPrice: { fontSize: 26, fontWeight: '900' },
  planPeriod: { color: C.gray, fontSize: 13 },
  activeTag: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 5 },
  choosBtn: { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 9 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  featureText: { color: C.dark, fontSize: 13, flex: 1 },
  featureDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  featureBox: { width: '100%', backgroundColor: C.grayLight, borderRadius: 18, padding: 18, marginBottom: 20 },
  // Nav
  bottomNav: { backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.border, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 24 },
  navBtn: { alignItems: 'center', gap: 3, paddingHorizontal: 16, position: 'relative' },
  navLabel: { fontSize: 10, fontWeight: '700', color: C.gray },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.orange, position: 'absolute', bottom: -2 },
  // Modals
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  matchBox: { backgroundColor: C.white, borderRadius: 28, padding: 28, alignItems: 'center', width: '100%' },
  matchTitle: { fontSize: 28, fontWeight: '900', color: C.orange, marginBottom: 8 },
  matchSub: { color: C.gray, textAlign: 'center', fontSize: 15, marginBottom: 20 },
  matchImg: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: C.orange, marginBottom: 20 },
  matchBtnSecondary: { backgroundColor: C.grayLight, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 13 },
  matchBtnPrimary: { backgroundColor: C.orange, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 13 },
  paywallBox: { backgroundColor: C.white, borderRadius: 28, padding: 28, alignItems: 'center', width: '100%', maxHeight: H * 0.85 },
  paywallTitle: { color: C.dark, fontSize: 24, fontWeight: '900', marginBottom: 8, textAlign: 'center' },
  paywallSub: { color: C.gray, fontSize: 14, textAlign: 'center', marginBottom: 24 },
  closeBtn: { position: 'absolute', top: 16, right: 16, backgroundColor: C.grayLight, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
