// The hero's lagoon. The poster still is rendered from the same shader (scripts/render-stills.mjs).
export const LAGOON_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = position.xy*0.5+0.5; gl_Position = vec4(position.xy, 1.0, 1.0); }`;

export const LAGOON_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime, uAspect, uSeed, uStars, uPitch, uYaw, uFov, uHeight, uOct;
uniform vec3 uZenith, uHorizon, uSun, uDeep, uShallow, uSunDir;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
const mat2 R=mat2(.8,.6,-.6,.8);
float fbm(vec2 p,int n){ float a=.5,s=0.; for(int i=0;i<8;i++){ if(i>=n)break; s+=a*noise(p); p=R*p*2.03; a*=.5; } return s; }

float caustic(vec2 p,float t){
  p=mod(p*6.2832,6.2832)-250.; vec2 i=p; float c=1.; const float k=.0065;
  for(int n=0;n<4;n++){ float q=t*(1.-3.5/float(n+1));
    i=p+vec2(cos(q-i.x)+sin(q+i.y),sin(q-i.y)+cos(q+i.x));
    c+=1./length(vec2(p.x/(sin(i.x+q)/k),p.y/(cos(i.y+q)/k))); }
  c/=4.; c=1.17-pow(c,1.4); return min(pow(abs(c),8.),1.4);
}

vec3 sky(vec3 rd){
  float y=max(rd.y,0.);
  vec3 c=mix(uHorizon,uZenith,pow(y,.48));
  float s=max(dot(rd,normalize(uSunDir)),0.);
  c+=uSun*pow(s,6.)*.22+uSun*pow(s,64.)*.5;
  c+=uSun*smoothstep(.9988,.9994,s);
  vec2 cp=rd.xz/(rd.y+.14)*1.1+vec2(uTime*.006,uSeed);
  float cl=smoothstep(.5,.86,fbm(cp,5))*smoothstep(0.,.2,rd.y);
  c=mix(c,mix(uHorizon*1.16,uSun,.2*pow(s,3.)),cl*.55);
  if(uStars>.01){
    vec2 g=vec2(atan(rd.x,-rd.z)*48.,rd.y*96.); vec2 id=floor(g); vec2 f=fract(g)-.5;
    float h=hash(id); float st=step(.965,h)*smoothstep(.09*fract(h*91.)+.02,0.,length(f));
    c+=vec3(.86,.92,1.)*st*uStars*smoothstep(0.,.1,rd.y)*(.6+.4*sin(uTime*1.3+h*90.));
  }
  return c;
}

vec3 horizon(vec2 uv){
  float t=tan(uFov*.5);
  vec3 rd=normalize(vec3(uv.x*uAspect*t,uv.y*t,-1.));
  float cp=cos(uPitch),sp=sin(uPitch); rd=vec3(rd.x,cp*rd.y-sp*rd.z,sp*rd.y+cp*rd.z);
  float cy=cos(uYaw),sy=sin(uYaw); rd=vec3(cy*rd.x+sy*rd.z,rd.y,-sy*rd.x+cy*rd.z);
  if(rd.y>=0.) return sky(rd);
  float d=uHeight/-rd.y; vec2 p=rd.xz*d; int oct=int(uOct);
  float T=uTime*.32;
  float e=.03+d*.0016;
  vec2 q=p*.42;
  float h0=fbm(q+vec2(T,T*.6),oct)+.5*fbm(q*2.3-vec2(T*1.3,0.),oct);
  float hx=fbm(q+vec2(e,0.)+vec2(T,T*.6),oct)+.5*fbm((q+vec2(e,0.))*2.3-vec2(T*1.3,0.),oct);
  float hz=fbm(q+vec2(0.,e)+vec2(T,T*.6),oct)+.5*fbm((q+vec2(0.,e))*2.3-vec2(T*1.3,0.),oct);
  float amp=.16*exp(-d*.008)+.015;
  vec3 n=normalize(vec3((h0-hx)/e*amp,1.,(h0-hz)/e*amp));
  vec3 r=reflect(rd,n);
  float F=.03+.97*pow(1.-max(dot(-rd,n),0.),5.);
  float bed=fbm(p*.018+uSeed,4);
  float shallow=smoothstep(.34,.66,bed)*exp(-d*.0036);
  vec3 w=mix(uDeep,uShallow,shallow*.95+.05);
  w+=uShallow*caustic(p*.5,uTime*.5)*.32*exp(-d*.05);
  r.y=abs(r.y);
  vec3 c=mix(w,sky(r),F);
  float s=max(dot(r,normalize(uSunDir)),0.);
  c+=uSun*pow(s,300.)*1.1;
  c=mix(c,uHorizon,1.-exp(-d*d*.0000042));
  return c;
}

void main(){
  vec2 uv=vUv*2.-1.;
  vec3 c = horizon(uv);
  c=c/(1.+c*.14)*1.1;
  c=pow(max(c,vec3(0.)),vec3(.96));
  float v=length(uv*vec2(.8,.9)); c*=1.-.32*smoothstep(.55,1.45,v);
  c+=(hash(gl_FragCoord.xy+fract(uTime))-.5)*.012;
  gl_FragColor=vec4(c,1.);
}`;
